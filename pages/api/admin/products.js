import connectDB from "@/lib/db";
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

    const { search = "", category = "All", status = "all", page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category !== "All") {
      query.category = category;
    }

    if (status === "in_stock") {
      query.$expr = { $gt: ["$totalStock", "$lowStockThreshold"] };
    } else if (status === "low_stock") {
      query.$expr = { $and: [{ $gt: ["$totalStock", 0] }, { $lte: ["$totalStock", "$lowStockThreshold"] }] };
    } else if (status === "out_of_stock") {
      query.totalStock = 0;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [products, total, categories] = await Promise.all([
      Product.find(query).sort("-createdAt").skip(skip).limit(limitNum),
      Product.countDocuments(query),
      Product.distinct("category"),
    ]);

    const productsWithStatus = products.map((p) => {
      let stockStatus = "in_stock";
      if (p.totalStock === 0) stockStatus = "out_of_stock";
      else if (p.totalStock <= p.lowStockThreshold) stockStatus = "low_stock";

      return { ...p.toObject(), stockStatus };
    });

    return res.status(200).json({
      success: true,
      products: productsWithStatus,
      categories,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    });
  } catch (error) {
    console.error("Admin products error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}