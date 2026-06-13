import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  await connectDB();
  const user = getUserFromReq(req);

  if (!user) {
    return res.status(401).json({ success: false, message: "Please log in" });
  }

  // GET - fetch cart
  if (req.method === "GET") {
    try {
      let cart = await Cart.findOne({ user: user.id });
      if (!cart) {
        cart = await Cart.create({ user: user.id, items: [] });
      }
      return res.status(200).json({ success: true, cart });
    } catch (error) {
      console.error("Get cart error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // POST - add item to cart
  if (req.method === "POST") {
    try {
      const { productId, quantity = 1, size = "", color = "" } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
      }

      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      let cart = await Cart.findOne({ user: user.id });
      if (!cart) {
        cart = await Cart.create({ user: user.id, items: [] });
      }

      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({
          product: product._id,
          name: product.name,
          image: product.images?.[0]?.url || "",
          price: product.discountPrice > 0 ? product.discountPrice : product.price,
          size,
          color,
          quantity: Number(quantity),
        });
      }

      await cart.save();
      return res.status(200).json({ success: true, message: "Item added to cart", cart });
    } catch (error) {
      console.error("Add to cart error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // PUT - update item quantity
  if (req.method === "PUT") {
    try {
      const { productId, quantity, size = "", color = "" } = req.body;

      if (!productId || quantity === undefined) {
        return res.status(400).json({ success: false, message: "Product ID and quantity are required" });
      }

      const cart = await Cart.findOne({ user: user.id });
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
      }

      const item = cart.items.find(
        (item) =>
          item.product.toString() === productId && item.size === size && item.color === color
      );

      if (!item) {
        return res.status(404).json({ success: false, message: "Item not found in cart" });
      }

      if (Number(quantity) <= 0) {
        cart.items = cart.items.filter((i) => i !== item);
      } else {
        item.quantity = Number(quantity);
      }

      await cart.save();
      return res.status(200).json({ success: true, message: "Cart updated", cart });
    } catch (error) {
      console.error("Update cart error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // DELETE - remove item or clear cart
  if (req.method === "DELETE") {
    try {
      const { productId, size = "", color = "", clearAll = false } = req.body;

      const cart = await Cart.findOne({ user: user.id });
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
      }

      if (clearAll) {
        cart.items = [];
      } else {
        cart.items = cart.items.filter(
          (item) =>
            !(item.product.toString() === productId && item.size === size && item.color === color)
        );
      }

      await cart.save();
      return res.status(200).json({ success: true, message: "Cart updated", cart });
    } catch (error) {
      console.error("Remove from cart error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}