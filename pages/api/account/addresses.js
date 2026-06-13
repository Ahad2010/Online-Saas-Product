import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  const tokenUser = getUserFromReq(req);
  if (!tokenUser) {
    return res.status(401).json({ success: false, message: "Please log in" });
  }

  await connectDB();

  if (req.method === "POST") {
    try {
      const user = await User.findById(tokenUser.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      user.addresses.push(req.body);
      await user.save();

      const updatedUser = await User.findById(tokenUser.id).select("-password");
      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Add address error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const user = await User.findById(tokenUser.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      user.addresses = user.addresses.filter((a) => a._id.toString() !== id);
      await user.save();

      const updatedUser = await User.findById(tokenUser.id).select("-password");
      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Delete address error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}