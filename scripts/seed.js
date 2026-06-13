// scripts/seed.js
// Run with: node scripts/seed.js
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    price: Number,
    discountPrice: Number,
    category: String,
    brand: String,
    images: [{ url: String, alt: String }],
    variants: [{ size: String, color: String, stock: Number, sku: String }],
    totalStock: Number,
    lowStockThreshold: Number,
    rating: Number,
    numReviews: Number,
    isActive: { type: Boolean, default: true },
    isFeatured: Boolean,
  },
  { timestamps: true }
);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

  // Create admin user
  const adminEmail = "admin@shophub.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin created -> email: admin@shophub.com | password: admin123");
  } else {
    console.log("Admin already exists");
  }

  // Clear existing products for a fresh catalog
  await Product.deleteMany({});
  console.log("Cleared existing products");

  const products = [
    // ===== MEN - FOOTWEAR =====
    {
      name: "Classic Leather Loafers",
      slug: "classic-leather-loafers",
      description: "Premium genuine leather slip-on loafers, perfect for formal and semi-formal occasions. Cushioned insole for all-day comfort.",
      price: 89.99,
      discountPrice: 62.99,
      category: "Men",
      brand: "Urbanwalk",
      images: [{ url: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80", alt: "Classic Leather Loafers" }],
      variants: [
        { size: "8", color: "Brown", stock: 25, sku: "MLL-BRN-08" },
        { size: "9", color: "Brown", stock: 30, sku: "MLL-BRN-09" },
        { size: "10", color: "Black", stock: 20, sku: "MLL-BLK-10" },
      ],
      totalStock: 75, lowStockThreshold: 10, rating: 4.5, numReviews: 128, isFeatured: true,
    },
    {
      name: "Urban Runner Sneakers",
      slug: "urban-runner-sneakers",
      description: "Lightweight breathable mesh sneakers designed for everyday wear and light running. Shock-absorbing sole technology.",
      price: 119.99,
      discountPrice: 83.99,
      category: "Men",
      brand: "FlexFit",
      images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", alt: "Urban Runner Sneakers" }],
      variants: [
        { size: "8", color: "Black", stock: 40, sku: "URS-BLK-08" },
        { size: "9", color: "White", stock: 35, sku: "URS-WHT-09" },
        { size: "10", color: "Navy", stock: 15, sku: "URS-NVY-10" },
      ],
      totalStock: 90, lowStockThreshold: 10, rating: 4.7, numReviews: 256, isFeatured: true,
    },
    {
      name: "Waterproof Formal Slip-Ons",
      slug: "waterproof-formal-slip-ons",
      description: "All-weather formal shoes with waterproof technology. Sleek design meets practical durability for the modern professional.",
      price: 149.99,
      discountPrice: 0,
      category: "Men",
      brand: "Urbanwalk",
      images: [{ url: "https://images.unsplash.com/photo-1582897085656-92847db84865?w=800&q=80", alt: "Waterproof Formal Slip-Ons" }],
      variants: [
        { size: "9", color: "Black", stock: 18, sku: "WFS-BLK-09" },
        { size: "10", color: "Brown", stock: 12, sku: "WFS-BRN-10" },
      ],
      totalStock: 30, lowStockThreshold: 8, rating: 4.6, numReviews: 84, isFeatured: false,
    },
    {
      name: "Comfort Walk Sandals",
      slug: "comfort-walk-sandals",
      description: "Open-toe sandals with adjustable straps and cushioned footbed. Ideal for casual summer outings.",
      price: 49.99,
      discountPrice: 34.99,
      category: "Men",
      brand: "FlexFit",
      images: [{ url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80", alt: "Comfort Walk Sandals" }],
      variants: [
        { size: "8", color: "Tan", stock: 22, sku: "CWS-TAN-08" },
        { size: "9", color: "Black", stock: 28, sku: "CWS-BLK-09" },
        { size: "10", color: "Tan", stock: 0, sku: "CWS-TAN-10" },
      ],
      totalStock: 50, lowStockThreshold: 10, rating: 4.3, numReviews: 67, isFeatured: false,
    },

    // ===== MEN - APPAREL =====
    {
      name: "Slim Fit Cotton Shirt",
      slug: "slim-fit-cotton-shirt",
      description: "100% cotton slim-fit shirt with a modern collar. Breathable fabric perfect for office or casual wear.",
      price: 39.99,
      discountPrice: 27.99,
      category: "Men",
      brand: "WeWear",
      images: [{ url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", alt: "Slim Fit Cotton Shirt" }],
      variants: [
        { size: "M", color: "White", stock: 35, sku: "SFCS-WHT-M" },
        { size: "L", color: "Blue", stock: 30, sku: "SFCS-BLU-L" },
        { size: "XL", color: "White", stock: 20, sku: "SFCS-WHT-XL" },
      ],
      totalStock: 85, lowStockThreshold: 15, rating: 4.4, numReviews: 92, isFeatured: false,
    },
    {
      name: "Classic Polo T-Shirt",
      slug: "classic-polo-tshirt",
      description: "Soft pique cotton polo with ribbed collar and cuffs. A timeless wardrobe essential.",
      price: 29.99,
      discountPrice: 0,
      category: "Men",
      brand: "WeWear",
      images: [{ url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80", alt: "Classic Polo T-Shirt" }],
      variants: [
        { size: "M", color: "Navy", stock: 40, sku: "CPT-NVY-M" },
        { size: "L", color: "Black", stock: 35, sku: "CPT-BLK-L" },
        { size: "XL", color: "Grey", stock: 25, sku: "CPT-GRY-XL" },
      ],
      totalStock: 100, lowStockThreshold: 15, rating: 4.5, numReviews: 145, isFeatured: true,
    },

    // ===== WOMEN - FOOTWEAR =====
    {
      name: "Elegant Block Heels",
      slug: "elegant-block-heels",
      description: "Comfortable block heel pumps with a pointed toe design. Perfect for office and evening wear.",
      price: 79.99,
      discountPrice: 55.99,
      category: "Women",
      brand: "Vogue Step",
      images: [{ url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", alt: "Elegant Block Heels" }],
      variants: [
        { size: "6", color: "Black", stock: 20, sku: "EBH-BLK-06" },
        { size: "7", color: "Nude", stock: 25, sku: "EBH-NUD-07" },
        { size: "8", color: "Black", stock: 15, sku: "EBH-BLK-08" },
      ],
      totalStock: 60, lowStockThreshold: 10, rating: 4.6, numReviews: 178, isFeatured: true,
    },
    {
      name: "Casual Canvas Sneakers",
      slug: "casual-canvas-sneakers-women",
      description: "Classic canvas sneakers with a comfortable fit. Versatile design pairs with any casual outfit.",
      price: 54.99,
      discountPrice: 38.49,
      category: "Women",
      brand: "FlexFit",
      images: [{ url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80", alt: "Casual Canvas Sneakers" }],
      variants: [
        { size: "6", color: "White", stock: 30, sku: "CCS-WHT-06" },
        { size: "7", color: "Pink", stock: 25, sku: "CCS-PNK-07" },
        { size: "8", color: "White", stock: 18, sku: "CCS-WHT-08" },
      ],
      totalStock: 73, lowStockThreshold: 10, rating: 4.5, numReviews: 203, isFeatured: true,
    },
    {
      name: "Strappy Flat Sandals",
      slug: "strappy-flat-sandals",
      description: "Minimalist strappy sandals with cushioned sole. Lightweight and perfect for warm-weather days.",
      price: 44.99,
      discountPrice: 0,
      category: "Women",
      brand: "Vogue Step",
      images: [{ url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80", alt: "Strappy Flat Sandals" }],
      variants: [
        { size: "6", color: "Gold", stock: 5, sku: "SFS-GLD-06" },
        { size: "7", color: "Silver", stock: 8, sku: "SFS-SLV-07" },
      ],
      totalStock: 13, lowStockThreshold: 10, rating: 4.2, numReviews: 56, isFeatured: false,
    },
    {
      name: "Cushioned Slide Slippers",
      slug: "cushioned-slide-slippers-women",
      description: "Ultra-soft slide slippers with memory foam cushioning. Perfect for home or quick errands.",
      price: 24.99,
      discountPrice: 17.49,
      category: "Women",
      brand: "FlexFit",
      images: [{ url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", alt: "Cushioned Slide Slippers" }],
      variants: [
        { size: "6", color: "Beige", stock: 32, sku: "CSS-BEI-06" },
        { size: "7", color: "Black", stock: 28, sku: "CSS-BLK-07" },
      ],
      totalStock: 60, lowStockThreshold: 10, rating: 4.4, numReviews: 134, isFeatured: false,
    },

    // ===== WOMEN - APPAREL =====
    {
      name: "Floral Summer Dress",
      slug: "floral-summer-dress",
      description: "Lightweight floral print dress with flowy silhouette. Perfect for summer outings and casual events.",
      price: 59.99,
      discountPrice: 41.99,
      category: "Women",
      brand: "WeWear",
      images: [{ url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", alt: "Floral Summer Dress" }],
      variants: [
        { size: "S", color: "Multicolor", stock: 18, sku: "FSD-MUL-S" },
        { size: "M", color: "Multicolor", stock: 22, sku: "FSD-MUL-M" },
        { size: "L", color: "Multicolor", stock: 15, sku: "FSD-MUL-L" },
      ],
      totalStock: 55, lowStockThreshold: 10, rating: 4.7, numReviews: 167, isFeatured: true,
    },
    {
      name: "Essential Crew Neck Tee",
      slug: "essential-crew-neck-tee",
      description: "Soft cotton blend crew neck t-shirt. A versatile basic for everyday styling.",
      price: 19.99,
      discountPrice: 0,
      category: "Women",
      brand: "WeWear",
      images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", alt: "Essential Crew Neck Tee" }],
      variants: [
        { size: "S", color: "White", stock: 40, sku: "ECT-WHT-S" },
        { size: "M", color: "Black", stock: 35, sku: "ECT-BLK-M" },
        { size: "L", color: "Grey", stock: 30, sku: "ECT-GRY-L" },
      ],
      totalStock: 105, lowStockThreshold: 15, rating: 4.5, numReviews: 198, isFeatured: false,
    },

    // ===== KIDS =====
    {
      name: "Kids School Shoes",
      slug: "kids-school-shoes",
      description: "Durable and comfortable school shoes with reinforced toe cap. Designed for active kids.",
      price: 34.99,
      discountPrice: 24.49,
      category: "Kids",
      brand: "LittleSteps",
      images: [{ url: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&q=80", alt: "Kids School Shoes" }],
      variants: [
        { size: "1", color: "Black", stock: 25, sku: "KSS-BLK-01" },
        { size: "2", color: "Black", stock: 30, sku: "KSS-BLK-02" },
        { size: "3", color: "Black", stock: 20, sku: "KSS-BLK-03" },
      ],
      totalStock: 75, lowStockThreshold: 12, rating: 4.6, numReviews: 89, isFeatured: true,
    },
    {
      name: "Kids Light-Up Sneakers",
      slug: "kids-light-up-sneakers",
      description: "Fun LED light-up sneakers that kids love. Comfortable fit with easy velcro straps.",
      price: 42.99,
      discountPrice: 0,
      category: "Kids",
      brand: "LittleSteps",
      images: [{ url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80", alt: "Kids Light-Up Sneakers" }],
      variants: [
        { size: "1", color: "Blue", stock: 18, sku: "KLS-BLU-01" },
        { size: "2", color: "Pink", stock: 22, sku: "KLS-PNK-02" },
      ],
      totalStock: 40, lowStockThreshold: 10, rating: 4.8, numReviews: 112, isFeatured: true,
    },
    {
      name: "Kids Sandals Set",
      slug: "kids-sandals-set",
      description: "Comfortable everyday sandals for kids with adjustable straps for a perfect fit.",
      price: 22.99,
      discountPrice: 15.99,
      category: "Kids",
      brand: "LittleSteps",
      images: [{ url: "https://images.unsplash.com/photo-1622760807800-cdc4a8a44a82?w=800&q=80", alt: "Kids Sandals Set" }],
      variants: [
        { size: "1", color: "Red", stock: 30, sku: "KSS2-RED-01" },
        { size: "2", color: "Blue", stock: 25, sku: "KSS2-BLU-02" },
      ],
      totalStock: 55, lowStockThreshold: 10, rating: 4.3, numReviews: 47, isFeatured: false,
    },

    // ===== ACCESSORIES =====
    {
      name: "Genuine Leather Wallet",
      slug: "genuine-leather-wallet",
      description: "Handcrafted genuine leather bifold wallet with multiple card slots and coin pocket.",
      price: 34.99,
      discountPrice: 24.49,
      category: "Accessories",
      brand: "Urbanwalk",
      images: [{ url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80", alt: "Genuine Leather Wallet" }],
      variants: [
        { size: "One Size", color: "Brown", stock: 45, sku: "GLW-BRN-OS" },
        { size: "One Size", color: "Black", stock: 38, sku: "GLW-BLK-OS" },
      ],
      totalStock: 83, lowStockThreshold: 15, rating: 4.7, numReviews: 234, isFeatured: true,
    },
    {
      name: "Classic Leather Belt",
      slug: "classic-leather-belt",
      description: "Premium leather belt with polished metal buckle. A versatile accessory for any outfit.",
      price: 29.99,
      discountPrice: 0,
      category: "Accessories",
      brand: "Urbanwalk",
      images: [{ url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80", alt: "Classic Leather Belt" }],
      variants: [
        { size: "32", color: "Black", stock: 28, sku: "CLB-BLK-32" },
        { size: "34", color: "Brown", stock: 32, sku: "CLB-BRN-34" },
        { size: "36", color: "Black", stock: 20, sku: "CLB-BLK-36" },
      ],
      totalStock: 80, lowStockThreshold: 15, rating: 4.5, numReviews: 156, isFeatured: false,
    },
    {
      name: "Premium Eau de Parfum",
      slug: "premium-eau-de-parfum",
      description: "Long-lasting signature fragrance with woody and citrus notes. Elegant glass bottle design.",
      price: 64.99,
      discountPrice: 45.49,
      category: "Accessories",
      brand: "Essence Co.",
      images: [{ url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80", alt: "Premium Eau de Parfum" }],
      variants: [{ size: "100ml", color: "Default", stock: 35, sku: "PEP-DEF-100" }],
      totalStock: 35, lowStockThreshold: 10, rating: 4.8, numReviews: 312, isFeatured: true,
    },
  ];

  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products successfully!`);
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});