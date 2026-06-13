import { useEffect, useState } from "react";
import Link from "next/link";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Truck, ShieldCheck, RotateCcw, Headset, Star, ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    title: "Spring Summer 2026",
    subtitle: "New Collection Live Now",
    desc: "Step into the season with styles designed for comfort and confidence.",
    cta: "Shop Collection",
    href: "/products",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=90",
  },
  {
    title: "Special Sale",
    subtitle: "Flat 30% & 50% Off",
    desc: "Limited time only — grab your favorites before they're gone.",
    cta: "Shop Sale",
    href: "/products",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&q=90",
  },
  {
    title: "Crafted for Comfort",
    subtitle: "Premium Footwear Collection",
    desc: "Every step matters. Discover footwear built to last, made to impress.",
    cta: "Explore Now",
    href: "/products",
    img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920&q=90",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    fetchFeatured();
    const interval = setInterval(() => {
      setBannerIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch("/api/products?limit=12");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ p }) => (
    <Link
      href={`/products/${p.slug}`}
      className="flex-shrink-0 w-60 bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {p.images?.[0]?.url ? (
          <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Image</div>
        )}
        <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          NEW IN
        </span>
        {p.discountPrice > 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Save {Math.round((1 - p.discountPrice / p.price) * 100)}%
          </span>
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
        {p.variants?.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {[...new Set(p.variants.map((v) => v.color).filter(Boolean))].slice(0, 4).map((color) => (
              <span
                key={color}
                title={color}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.toLowerCase() }}
              ></span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <StorefrontLayout>
      {/* Hero Banner Carousel */}
      <section className="relative w-full h-[380px] md:h-[560px] overflow-hidden bg-gray-900">
        {banners.map((b, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-1000 ${
              i === bannerIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
                <div className="max-w-xl text-white">
                  <span className="inline-block bg-primary-600/90 backdrop-blur-sm text-xs font-bold px-4 py-2 rounded-full mb-4 tracking-widest uppercase">
                    {b.subtitle}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">{b.title}</h1>
                  <p className="text-base md:text-lg text-gray-200 mb-6 max-w-md">{b.desc}</p>
                  <Link
                    href={b.href}
                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-full hover:bg-primary-600 hover:text-white transition-all duration-300 shadow-xl"
                  >
                    {b.cta}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={() => setBannerIndex((i) => (i - 1 + banners.length) % banners.length)}
          className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 p-3 rounded-full shadow-md z-10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setBannerIndex((i) => (i + 1) % banners.length)}
          className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 p-3 rounded-full shadow-md z-10 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Progress bar indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIndex(i)}
              className="h-1 rounded-full overflow-hidden bg-white/30 transition-all"
              style={{ width: i === bannerIndex ? "48px" : "20px" }}
            >
              {i === bannerIndex && (
                <div className="h-full bg-white animate-progress" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Free Delivery", desc: "On prepaid orders", icon: Truck },
            { title: "Easy Returns", desc: "7-day return policy", icon: RotateCcw },
            { title: "Secure Payments", desc: "100% protected", icon: ShieldCheck },
            { title: "24/7 Support", desc: "We're here to help", icon: Headset },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 mt-1">Find exactly what you're looking for.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { name: "Men", img: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&q=80" },
            { name: "Women", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
            { name: "Kids", img: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&q=80" },
            { name: "Accessories", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="relative rounded-2xl overflow-hidden group h-56"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-white font-bold text-xl">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New In Men */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New In Men</h2>
            <p className="text-sm text-gray-500 mt-1">Latest styles for him.</p>
          </div>
          <Link href="/products?category=Men" className="text-primary-600 font-medium text-sm hover:text-primary-700">
            View All
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-2">
          {products.slice(0, 6).map((p) => <ProductCard key={p._id} p={p} />)}
          {products.length === 0 && !loading && <p className="text-gray-400 py-10 w-full text-center">No products yet</p>}
        </div>
      </section>

      {/* New In Women */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New In Women</h2>
            <p className="text-sm text-gray-500 mt-1">Latest styles for her.</p>
          </div>
          <Link href="/products?category=Women" className="text-primary-600 font-medium text-sm hover:text-primary-700">
            View All
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-2">
          {products.slice(6, 12).map((p) => <ProductCard key={p._id} p={p} />)}
          {products.slice(6, 12).length === 0 && !loading && <p className="text-gray-400 py-10 w-full text-center">No products yet</p>}
        </div>
      </section>

      {/* Banner Promo */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative rounded-3xl overflow-hidden h-56">
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80" alt="Promo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Crafted for Comfort, Built to Last</h2>
              <Link href="/products" className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors inline-block">
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-y border-gray-100 py-14 mt-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Happy Customers</h2>
            <p className="text-gray-500 mt-2">What our customers are saying about us.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Ahmad Saeed", text: "Very comfortable and perfect for everyday wear. Great quality and fast delivery every time.", rating: 5 },
              { name: "Hamdaan", text: "Perfect mix of casual and formal — exactly what I was looking for in an online store.", rating: 5 },
              { name: "Sameen Rudaba", text: "Didn't expect this level of service. Really impressed with the support team.", rating: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">@ShopHubOfficial</h2>
          <p className="text-gray-500 mt-1">Follow us for daily inspiration.</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80",
            "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=300&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80",
          ].map((img, i) => (
            <a key={i} href="#" className="aspect-square rounded-xl overflow-hidden group">
              <img src={img} alt={`Instagram ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </a>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-gray-900 rounded-3xl px-8 md:px-14 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Stay in the Loop</h2>
          <p className="text-gray-400 mb-6">Subscribe to get exclusive promotions, new arrivals, and private sales.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button type="submit" className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-700 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </StorefrontLayout>
  );
}