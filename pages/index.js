 import { useEffect, useState } from "react";
import Link from "next/link";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Search } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch("/api/products?limit=8");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Manage Orders, Inventory & Customers in <span className="text-primary-600">One Place</span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Discover quality products with fast delivery and easy tracking — all in one shop.
            </p>
            <div className="flex gap-3 mt-6">
              <Link href="/products" className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Shop Now
              </Link>
              <Link href="/products" className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Browse Categories
              </Link>
            </div>
            <div className="flex gap-8 mt-10">
              <div>
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-500">Active Stores</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">500K+</p>
                <p className="text-sm text-gray-500">Orders Processed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">99.9%</p>
                <p className="text-sm text-gray-500">Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-500">Support</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-80 flex items-center justify-center text-gray-300 font-semibold">
            Hero Image
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products" className="text-primary-600 font-medium text-sm hover:text-primary-700">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link key={p._id} href={`/products/${p.slug}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-sm overflow-hidden">
                {p.images?.[0]?.url ? (
                  <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  "Image"
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-0.5">{p.category}</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {p.discountPrice > 0 ? (
                    <>
                      <span className="text-sm font-bold text-primary-600">${p.discountPrice.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 line-through">${p.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-gray-900">${p.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {products.length === 0 && !loading && (
            <p className="col-span-4 text-center text-gray-400 py-10">No products available yet</p>
          )}
        </div>
      </section>
    </StorefrontLayout>
  );
}