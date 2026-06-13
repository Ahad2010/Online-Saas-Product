import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const {
        search = "",
        category = "",
        minPrice,
        maxPrice,
        sort = "-createdAt",
        page = 1,
        limit = 12,
        status,
      } = req.query;

      const query = { isActive: true };

      if (search) {
        query.$text = { $search: search };
      }

      if (category && category !== "All") {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (status === "low_stock") {
        query.$expr = { $lte: ["$totalStock", "$lowStockThreshold"] };
      } else if (status === "out_of_stock") {
        query.totalStock = 0;
      }

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, parseInt(limit));
      const skip = (pageNum - 1) * limitNum;

      const [products, total] = await Promise.all([
        Product.find(query).sort(sort).skip(skip).limit(limitNum),
        Product.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        products,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
      });
    } catch (error) {
      console.error("Get products error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const user = getUserFromReq(req);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const {
        name,
        description,
        price,
        discountPrice,
        category,
        brand,
        images,
        variants,
        lowStockThreshold,
        isFeatured,
      } = req.body;

      if (!name || !description || !price || !category) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const existingSlug = await Product.findOne({ slug });
      const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

      const product = await Product.create({
        name,
        slug: finalSlug,
        description,
        price,
        discountPrice: discountPrice || 0,
        category,
        brand: brand || "",
        images: images || [],
        variants: variants || [],
        lowStockThreshold: lowStockThreshold ?? 5,
        isFeatured: isFeatured || false,
      });

      return res.status(201).json({ success: true, message: "Product created", product });
    } catch (error) {
      console.error("Create product error:", error);
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: "A product with this name already exists" });
      }
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}