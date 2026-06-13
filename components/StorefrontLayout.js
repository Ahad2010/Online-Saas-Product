import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Store, ShoppingCart, User, Search, LogOut } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">ShopHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <Link href="/products" className="hover:text-primary-600">Products</Link>
            <Link href="/orders" className="hover:text-primary-600">My Orders</Link>
          </nav>

          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/products?search=${e.target.value}`);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/account" className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {user.name?.charAt(0)}
                  </div>
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-gray-50 rounded-lg" title="Logout">
                  <LogOut className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ShopHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}