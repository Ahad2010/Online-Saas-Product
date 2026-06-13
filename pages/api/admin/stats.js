import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
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

    const [totalRevenueResult, totalOrders, totalCustomers, lowStockProducts, recentOrders, topProducts] =
      await Promise.all([
        Order.aggregate([
          { $match: { status: { $ne: "cancelled" } } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        Order.countDocuments(),
        User.countDocuments({ role: "customer" }),
        Product.countDocuments({ $expr: { $lte: ["$totalStock", "$lowStockThreshold"] } }),
        Order.find().populate("user", "name").sort("-createdAt").limit(5),
        Product.find().sort("-numReviews").limit(5).select("name price images totalStock"),
      ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Sales overview - last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesOverview = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Order status breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        lowStockProducts,
      },
      recentOrders,
      topProducts,
      salesOverview,
      statusBreakdown,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}