import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, ShoppingCart } from "lucide-react";

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // Fetch by slug via products list (since /api/products/[id] uses ObjectId)
      const res = await fetch(`/api/products?search=${slug}&limit=50`);
      const data = await res.json();
      if (data.success) {
        const found = data.products.find((p) => p.slug === slug);
        if (found) {
          setProduct(found);
          if (found.variants?.length > 0) {
            setSelectedSize(found.variants[0].size);
            setSelectedColor(found.variants[0].color);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    setMessage("");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setMessage(data.message);
      } else {
        setMessage("Added to cart successfully!");
      }
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-gray-400">Loading...</div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-gray-400">Product not found</div>
      </StorefrontLayout>
    );
  }

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const currentVariant = product.variants?.find((v) => v.size === selectedSize && v.color === selectedColor);
  const availableStock = currentVariant ? currentVariant.stock : product.totalStock;
  const sizes = [...new Set(product.variants?.map((v) => v.size))];
  const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3">
              {product.images?.[activeImage]?.url ? (
                <img src={product.images[activeImage].url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg border-2 overflow-hidden ${activeImage === i ? "border-primary-600" : "border-gray-100"}`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-primary-600 font-medium mb-1">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">${displayPrice.toFixed(2)}</span>
              {product.discountPrice > 0 && (
                <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
              )}
              {product.discountPrice > 0 && (
                <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {sizes.length > 0 && sizes[0] && (
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selectedSize === size ? "bg-primary-600 text-white border-primary-600" : "border-gray-200 text-gray-700 hover:border-primary-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selectedColor === color ? "bg-primary-600 text-white border-primary-600" : "border-gray-200 text-gray-700 hover:border-primary-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-gray-50">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-semibold text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))} className="p-2.5 hover:bg-gray-50">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className={`text-sm font-medium ${availableStock === 0 ? "text-red-600" : availableStock <= 5 ? "text-yellow-600" : "text-green-600"}`}>
                  {availableStock === 0 ? "Out of Stock" : `${availableStock} in stock`}
                </span>
              </div>
            </div>

            {message && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {message}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={adding || availableStock === 0}
              className="w-full bg-primary-600 text-white font-semibold py-3.5 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {adding ? "Adding..." : availableStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck className="w-5 h-5 text-primary-600" />
                <span className="text-xs text-gray-500">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-primary-600" />
                <span className="text-xs text-gray-500">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <RotateCcw className="w-5 h-5 text-primary-600" />
                <span className="text-xs text-gray-500">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}