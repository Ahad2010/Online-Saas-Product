import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { getUserFromReq } from "@/lib/auth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  if (req.method === "GET") {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      return res.status(200).json({ success: true, product });
    } catch (error) {
      console.error("Get product error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const user = getUserFromReq(req);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const updates = req.body;
      delete updates.slug; // prevent slug overwrite via this route

      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return res.status(200).json({ success: true, message: "Product updated", product });
    } catch (error) {
      console.error("Update product error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const user = getUserFromReq(req);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
      console.error("Delete product error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}