import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Store, ShoppingCart, LogOut, Mail, Phone, MapPin, Search } from "lucide-react";

export default function StorefrontLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchUser();
    fetchCart();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (err) {}
  };

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) {
        const count = data.cart.items.reduce((sum, i) => sum + i.quantity, 0);
        setCartCount(count);
      }
    } catch (err) {}
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  const socialLinks = [
    { label: "f", name: "Facebook" },
    { label: "X", name: "Twitter" },
    { label: "ig", name: "Instagram" },
    { label: "in", name: "LinkedIn" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Marquee announcement bar */}
      <div className="bg-primary-600 text-white text-xs font-medium py-2 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee">
          <div className="flex items-center gap-8 px-4">
            <span>🚚 Free Delivery on orders over $50</span>
            <span>🎉 Use code WELCOME10 for 10% off your first order</span>
            <span>⚡ Flash Sale: Up to 40% off on Electronics</span>
            <span>📦 Easy 7-day returns on all products</span>
          </div>
          <div className="flex items-center gap-8 px-4" aria-hidden="true">
            <span>🚚 Free Delivery on orders over $50</span>
            <span>🎉 Use code WELCOME10 for 10% off your first order</span>
            <span>⚡ Flash Sale: Up to 40% off on Electronics</span>
            <span>📦 Easy 7-day returns on all products</span>
          </div>
        </div>
      </div>
 

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-sm">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">ShopHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            <Link href="/orders" className="hover:text-primary-600 transition-colors">My Orders</Link>
          </nav>

          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/products?search=${e.target.value}`);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2.5 hover:bg-gray-50 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/account" className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {user.name?.charAt(0)}
                  </div>
                </Link>
                <button onClick={handleLogout} className="p-2.5 hover:bg-gray-50 rounded-full transition-colors" title="Logout">
                  <LogOut className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center">
                <Store className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ShopHub</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your one-stop shop for quality products, fast delivery, and reliable customer support.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((s) => (
                <a key={s.name} href="#" title={s.name} className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors text-xs font-bold">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                123 Main Street, Lahore, Pakistan
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +92 300 1234567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                support@shophub.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <p>© {new Date().getFullYear()} ShopHub. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}