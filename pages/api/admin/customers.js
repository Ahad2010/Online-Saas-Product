import connectDB from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const adminUser = getUserFromReq(req);
  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }

  try {
    await connectDB();

    const { search = "", page = 1, limit = 10 } = req.query;
    const query = { role: "customer" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort("-createdAt").skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    // Get order stats for each customer
    const customers = await Promise.all(
      users.map(async (u) => {
        const orders = await Order.find({ user: u._id, status: { $ne: "cancelled" } });
        const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          createdAt: u.createdAt,
          orderCount: orders.length,
          totalSpent,
        };
      })
    );

    return res.status(200).json({
      success: true,
      customers,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    });
  } catch (error) {
    console.error("Admin customers error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}