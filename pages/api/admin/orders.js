import connectDB from "@/lib/db";
import Order from "@/models/Order";
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

    const { search = "", page = 1, limit = 50 } = req.query;
    const query = {};

    if (search) {
      const users = await (await import("@/models/User")).default.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { user: { $in: users.map((u) => u._id) } },
      ];
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

    // Group by status for kanban view
    const grouped = {
      pending: [],
      processing: [],
      shipped: [],
      delivered: [],
      cancelled: [],
    };

    orders.forEach((order) => {
      if (grouped[order.status]) {
        grouped[order.status].push(order);
      }
    });

    return res.status(200).json({
      success: true,
      orders,
      grouped,
      counts: {
        pending: grouped.pending.length,
        processing: grouped.processing.length,
        shipped: grouped.shipped.length,
        delivered: grouped.delivered.length,
        cancelled: grouped.cancelled.length,
      },
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    });
  } catch (error) {
    console.error("Admin orders error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}