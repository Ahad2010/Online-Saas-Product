import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Store, ShoppingCart, LogOut, Mail, Phone, MapPin, Search, ChevronDown, User, X } from "lucide-react";

const megaMenu = {
  Men: {
    Footwear: ["Formals", "Casual", "Sneakers", "Sandals", "Slippers"],
    Apparel: ["Shirts", "Polo", "T-Shirts", "Bottoms"],
    Accessories: ["Belts", "Wallets", "Shoe Care"],
  },
  Women: {
    Footwear: ["Heels & Wedges", "Pumps", "Casual", "Sneakers", "Sandals"],
    Apparel: ["Shirts", "Dresses", "T-Shirts", "Bottoms"],
    Accessories: ["Fragrances", "Shoe Care"],
  },
  Kids: {
    Boys: ["School Shoes", "Sandals", "Sneakers"],
    Girls: ["School Shoes", "Sneakers", "Pumps", "Sandals"],
  },
  Accessories: {
    Shop: ["Wallets", "Belts", "Fragrances", "Shoe Care", "Bestsellers"],
  },
};

const socialLinks = [
  { label: "f", name: "Facebook" },
  { label: "X", name: "Twitter" },
  { label: "ig", name: "Instagram" },
  { label: "in", name: "LinkedIn" },
];

export default function StorefrontLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Marquee announcement bar */}
      <div className="bg-gray-900 text-white text-xs font-medium py-2.5 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee">
          <div className="flex items-center gap-10 px-5">
            <span>Business Days: Monday to Friday (9:30 AM - 5:30 PM)</span>
            <span>•</span>
            <span>Helpline: 042-111-SHOPHUB (746-7482)</span>
            <span>•</span>
            <span>Free Delivery on prepaid orders over $50</span>
            <span>•</span>
            <span>New Arrivals — Live Now</span>
          </div>
          <div className="flex items-center gap-10 px-5" aria-hidden="true">
            <span>Business Days: Monday to Friday (9:30 AM - 5:30 PM)</span>
            <span>•</span>
            <span>Helpline: 042-111-SHOPHUB (746-7482)</span>
            <span>•</span>
            <span>Free Delivery on prepaid orders over $50</span>
            <span>•</span>
            <span>New Arrivals — Live Now</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm" onMouseLeave={() => setActiveMenu(null)}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-sm">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">ShopHub</span>
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-700 tracking-wide uppercase">
            <Link href="/products" className="hover:text-primary-600 transition-colors">New Arrivals</Link>
            {Object.keys(megaMenu).map((cat) => (
              <div key={cat} className="relative" onMouseEnter={() => setActiveMenu(cat)}>
                <button className="hover:text-primary-600 transition-colors flex items-center gap-1">
                  {cat}
                </button>
                {activeMenu === cat && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full bg-white border border-gray-100 rounded-xl shadow-xl p-6 flex gap-10 z-40 min-w-[420px] mt-1">
                    {Object.entries(megaMenu[cat]).map(([group, items]) => (
                      <div key={group}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-normal">{group}</h4>
                        <ul className="space-y-2">
                          {items.map((item) => (
                            <li key={item}>
                              <Link
                                href={`/products?search=${item}`}
                                className="text-sm text-gray-600 hover:text-primary-600 transition-colors font-normal normal-case"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/products?category=Apparel" className="hover:text-primary-600 transition-colors">Apparel</Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/account" className="p-2.5 hover:bg-gray-50 rounded-full transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
                  {user.name?.charAt(0)}
                </div>
              </Link>
            ) : (
              <Link href="/login" className="p-2.5 hover:bg-gray-50 rounded-full transition-colors" title="Login">
                <User className="w-5 h-5 text-gray-700" />
              </Link>
            )}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <Link href="/cart" className="relative p-2.5 hover:bg-gray-50 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            {user && (
              <button onClick={handleLogout} className="p-2.5 hover:bg-gray-50 rounded-full transition-colors" title="Logout">
                <LogOut className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Sale strip */}
        <div className="bg-primary-50 border-t border-primary-100 text-center py-2">
          <Link href="/products" className="text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors tracking-wide">
            SPECIAL SALE — FLAT 30% & 50% OFF
          </Link>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSearchOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Search Products</h2>
              <button onClick={() => setSearchOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                  setSearchQuery("");
                }
              }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, categories, brands..."
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Sneakers", "Formals", "Sandals", "Heels", "Wallets", "Bags"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      router.push(`/products?search=${tag}`);
                      setSearchOpen(false);
                    }}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 text-gray-600 text-sm rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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