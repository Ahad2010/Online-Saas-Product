import { useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Plus, Trash2 } from "lucide-react";

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    lowStockThreshold: 5,
  });
  const [variants, setVariants] = useState([{ size: "", color: "", stock: "", sku: "" }]);
  const [images, setImages] = useState([{ url: "", alt: "" }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => setVariants([...variants, { size: "", color: "", stock: "", sku: "" }]);
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

  const handleImageChange = (index, field, value) => {
    const updated = [...images];
    updated[index][field] = value;
    setImages(updated);
  };

  const addImage = () => setImages([...images, { url: "", alt: "" }]);
  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          discountPrice: Number(form.discountPrice) || 0,
          lowStockThreshold: Number(form.lowStockThreshold) || 5,
          variants: variants
            .filter((v) => v.size)
            .map((v) => ({ ...v, stock: Number(v.stock) || 0 })),
          images: images.filter((i) => i.url),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      router.push("/admin/products");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar user={null} />

        <main className="p-6 max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Product</h1>
          <p className="text-sm text-gray-500 mb-6">Create a new product listing.</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Price ($)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    min="0"
                    step="0.01"
                    value={form.discountPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Electronics"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Low Stock Threshold</label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  min="0"
                  value={form.lowStockThreshold}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Images</h2>
                <button type="button" onClick={addImage} className="flex items-center gap-1 text-sm text-primary-600 font-medium">
                  <Plus className="w-4 h-4" /> Add Image
                </button>
              </div>
              {images.map((img, i) => (
                <div key={i} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => handleImageChange(i, "url", e.target.value)}
                      placeholder="/uploads/product.jpg"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Alt Text</label>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => handleImageChange(i, "alt", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  {images.length > 1 && (
                    <button type="button" onClick={() => removeImage(i)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Variants */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Variants & Stock</h2>
                <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm text-primary-600 font-medium">
                  <Plus className="w-4 h-4" /> Add Variant
                </button>
              </div>
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Size</label>
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => handleVariantChange(i, "size", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Color</label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => handleVariantChange(i, "color", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">SKU</label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => handleVariantChange(i, "sku", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="col-span-1">
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Product"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/products")}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}