import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import StorefrontLayout from "@/components/StorefrontLayout";

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
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              🎉 New Arrivals Every Week
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Manage Orders, Inventory & Customers in <span className="text-primary-600">One Place</span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Discover quality products with fast delivery and easy tracking — all in one shop.
            </p>
            <div className="flex gap-3 mt-6">
              <Link href="/products" className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
                Shop Now
              </Link>
              <Link href="/products" className="bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors">
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
          <div className="relative">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary-300 rounded-full blur-3xl opacity-40"></div>
            <div className="relative rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                alt="Online shopping"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">✓</div>
              <div>
                <p className="text-sm font-bold text-gray-900">Order Confirmed</p>
                <p className="text-xs text-gray-500">Delivered in 2 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Shop With ShopHub</h2>
          <p className="text-gray-500 mt-2">Everything you need for a smooth shopping experience.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Fast Delivery", desc: "Get your orders delivered quickly, right to your doorstep.", icon: Truck },
            { title: "Secure Payments", desc: "Your transactions are protected with industry-standard security.", icon: ShieldCheck },
            { title: "Easy Returns", desc: "Hassle-free returns and refunds within 7 days of delivery.", icon: RotateCcw },
            { title: "24/7 Support", desc: "Our support team is always here to help you anytime.", icon: Headset },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80" },
            { name: "Bags", img: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&q=80" },
            { name: "Footwear", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
            { name: "Accessories", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="relative rounded-2xl overflow-hidden group h-44"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-white font-bold text-lg">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-14">
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

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl px-8 md:px-14 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-16 -left-10 w-72 h-72 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Get 20% Off Your First Order</h2>
            <p className="text-primary-100 mt-2">Sign up today and enjoy exclusive deals on your first purchase.</p>
          </div>
          <Link href="/register" className="relative z-10 bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap shadow-lg">
            Create Account
          </Link>
        </div>
      </section>
    </StorefrontLayout>
  );
}