import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromReq } from "@/lib/auth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  const user = getUserFromReq(req);

  if (!user) {
    return res.status(401).json({ success: false, message: "Please log in" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid order ID" });
  }

  if (req.method === "GET") {
    try {
      const order = await Order.findById(id).populate("user", "name email phone");
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      if (user.role !== "admin" && order.user._id.toString() !== user.id) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      return res.status(200).json({ success: true, order });
    } catch (error) {
      console.error("Get order error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      if (user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const { status, trackingId, note } = req.body;
      const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      if (status) {
        order.status = status;
        order.statusHistory.push({ status, note: note || "", changedAt: new Date() });

        if (status === "delivered") {
          order.deliveredAt = new Date();
        }
      }

      if (trackingId !== undefined) {
        order.trackingId = trackingId;
      }

      await order.save();

      return res.status(200).json({ success: true, message: "Order updated", order });
    } catch (error) {
      console.error("Update order error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}