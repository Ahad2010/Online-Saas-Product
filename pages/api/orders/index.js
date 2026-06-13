import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  await connectDB();
  const user = getUserFromReq(req);

  if (!user) {
    return res.status(401).json({ success: false, message: "Please log in" });
  }

  // GET - list orders (own orders for customer, all orders for admin)
  if (req.method === "GET") {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const query = {};

      if (user.role !== "admin") {
        query.user = user.id;
      }

      if (status && status !== "all") {
        query.status = status;
      }

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, parseInt(limit));
      const skip = (pageNum - 1) * limitNum;

      const [orders, total] = await Promise.all([
        Order.find(query)
          .populate("user", "name email")
          .sort("-createdAt")
          .skip(skip)
          .limit(limitNum),
        Order.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        orders,
        pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
      });
    } catch (error) {
      console.error("Get orders error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // POST - place a new order
  if (req.method === "POST") {
    try {
      const { shippingAddress, paymentMethod = "cod" } = req.body;

      if (!shippingAddress) {
        return res.status(400).json({ success: false, message: "Shipping address is required" });
      }

      const requiredFields = ["fullName", "phone", "addressLine1", "city", "state", "postalCode", "country"];
      for (const field of requiredFields) {
        if (!shippingAddress[field]) {
          return res.status(400).json({ success: false, message: `Shipping address: ${field} is required` });
        }
      }

      const cart = await Cart.findOne({ user: user.id });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Your cart is empty" });
      }

      // Verify stock availability
      for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ success: false, message: `Product ${item.name} no longer exists` });
        }
        if (product.totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${item.name}. Available: ${product.totalStock}`,
          });
        }
      }

      const itemsPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingPrice = itemsPrice > 5000 ? 0 : 200;
      const taxPrice = Math.round(itemsPrice * 0.0);
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;

      const order = await Order.create({
        user: user.id,
        orderNumber,
        items: cart.items,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        status: "pending",
        statusHistory: [{ status: "pending", note: "Order placed successfully" }],
      });

      // Deduct stock
      for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (item.size || item.color) {
          const variant = product.variants.find((v) => v.size === item.size && v.color === item.color);
          if (variant) variant.stock -= item.quantity;
        }
        product.totalStock -= item.quantity;
        await product.save();
      }

      // Clear cart
      cart.items = [];
      await cart.save();

      return res.status(201).json({ success: true, message: "Order placed successfully", order });
    } catch (error) {
      console.error("Create order error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}