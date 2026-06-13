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

  // Sample products
  const sampleProducts = [
    {
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
      price: 129.0,
      discountPrice: 0,
      category: "Electronics",
      brand: "SoundMax",
      images: [{ url: "/uploads/headphones.jpg", alt: "Wireless Headphones" }],
      variants: [{ size: "Standard", color: "Black", stock: 120, sku: "WH-BLK-01" }],
      totalStock: 120,
      lowStockThreshold: 10,
      isFeatured: true,
    },
    {
      name: "Smart Watch Series 5",
      slug: "smart-watch-series-5",
      description: "Track your fitness, heart rate, and notifications with this sleek smart watch.",
      price: 199.0,
      discountPrice: 0,
      category: "Electronics",
      brand: "TechFit",
      images: [{ url: "/uploads/smartwatch.jpg", alt: "Smart Watch" }],
      variants: [{ size: "42mm", color: "Silver", stock: 85, sku: "SW-SLV-42" }],
      totalStock: 85,
      lowStockThreshold: 10,
      isFeatured: true,
    },
    {
      name: "Leather Backpack",
      slug: "leather-backpack",
      description: "Durable genuine leather backpack, perfect for work and travel.",
      price: 89.0,
      discountPrice: 0,
      category: "Bags",
      brand: "UrbanCraft",
      images: [{ url: "/uploads/backpack.jpg", alt: "Leather Backpack" }],
      variants: [{ size: "One Size", color: "Brown", stock: 8, sku: "BP-BRN-01" }],
      totalStock: 8,
      lowStockThreshold: 10,
      isFeatured: false,
    },
    {
      name: "Running Sneakers",
      slug: "running-sneakers",
      description: "Lightweight running sneakers with breathable mesh upper.",
      price: 149.0,
      discountPrice: 0,
      category: "Footwear",
      brand: "RunFast",
      images: [{ url: "/uploads/sneakers.jpg", alt: "Running Sneakers" }],
      variants: [{ size: "10", color: "White", stock: 0, sku: "SN-WHT-10" }],
      totalStock: 0,
      lowStockThreshold: 10,
      isFeatured: false,
    },
    {
      name: "Blue Light Glasses",
      slug: "blue-light-glasses",
      description: "Protect your eyes from digital screen strain with these stylish glasses.",
      price: 49.0,
      discountPrice: 0,
      category: "Accessories",
      brand: "ClearView",
      images: [{ url: "/uploads/glasses.jpg", alt: "Blue Light Glasses" }],
      variants: [{ size: "One Size", color: "Black", stock: 60, sku: "BG-BLK-01" }],
      totalStock: 60,
      lowStockThreshold: 10,
      isFeatured: false,
    },
    {
      name: "USB-C Hub Adapter",
      slug: "usb-c-hub-adapter",
      description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader and more.",
      price: 39.0,
      discountPrice: 0,
      category: "Electronics",
      brand: "ConnectPro",
      images: [{ url: "/uploads/usbhub.jpg", alt: "USB-C Hub" }],
      variants: [{ size: "One Size", color: "Gray", stock: 30, sku: "UH-GRY-01" }],
      totalStock: 30,
      lowStockThreshold: 10,
      isFeatured: false,
    },
  ];

  for (const p of sampleProducts) {
    const exists = await Product.findOne({ slug: p.slug });
    if (!exists) {
      await Product.create(p);
      console.log(`Created product: ${p.name}`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});