import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const tokenUser = getUserFromReq(req);
  if (!tokenUser) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    await connectDB();
    const user = await User.findById(tokenUser.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}