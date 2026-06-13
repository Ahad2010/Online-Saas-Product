// models/Product.js
import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    color: { type: String, default: "" },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, default: "" },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      default: "",
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" },
      },
    ],
    variants: [VariantSchema],
    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-calculate totalStock from variants before save
ProductSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  next();
});

// Virtual: isLowStock
ProductSchema.virtual("isLowStock").get(function () {
  return this.totalStock <= this.lowStockThreshold;
});

ProductSchema.set("toJSON", { virtuals: true });

ProductSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);