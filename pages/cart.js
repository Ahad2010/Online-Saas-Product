import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      } else if (res.status === 401) {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (item, newQty) => {
    setUpdating(`${item.product}-${item.size}-${item.color}`);
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.product,
          quantity: newQty,
          size: item.size,
          color: item.color,
        }),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (item) => {
    setUpdating(`${item.product}-${item.size}-${item.color}`);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.product,
          size: item.size,
          color: item.color,
        }),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : subtotal > 0 ? 200 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-gray-400">Loading...</div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Shopping Cart</h1>
        <p className="text-sm text-gray-500 mb-6">{cart.items.length} item(s) in your cart</p>

        {cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <ShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h2>
            <p className="text-sm text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/products" className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const key = `${item.product}-${item.size}-${item.color}`;
                return (
                  <div key={key} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">IMG</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.size && `Size: ${item.size}`} {item.color && `· Color: ${item.color}`}
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        disabled={updating === key}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        disabled={updating === key}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-bold text-gray-900 w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item)}
                      disabled={updating === key}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {subtotal < 5000 && subtotal > 0 && (
                  <p className="text-xs text-primary-600 bg-primary-50 px-3 py-2 rounded-lg">
                    Add ${(5000 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2.5 border-t border-gray-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full mt-5 bg-primary-600 text-white font-semibold py-3 rounded-full hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}