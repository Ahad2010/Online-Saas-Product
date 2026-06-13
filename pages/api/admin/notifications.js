import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const user = getUserFromReq(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }

  try {
    await connectDB();

    const [recentOrders, lowStockProducts] = await Promise.all([
      Order.find().populate("user", "name").sort("-createdAt").limit(5),
      Product.find({ $expr: { $lte: ["$totalStock", "$lowStockThreshold"] } }).limit(5).select("name totalStock"),
    ]);

    const notifications = [
      ...recentOrders.map((o) => ({
        id: o._id,
        type: "order",
        title: "New order received",
        message: `Order ${o.orderNumber} from ${o.user?.name || "Unknown"}`,
        time: o.createdAt,
        link: "/admin/orders",
      })),
      ...lowStockProducts.map((p) => ({
        id: p._id,
        type: "stock",
        title: "Low stock alert",
        message: `${p.name} is running low (${p.totalStock} left)`,
        time: new Date(),
        link: "/admin/products",
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time));

    return res.status(200).json({ success: true, notifications, count: notifications.length });
  } catch (error) {
    console.error("Notifications error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}