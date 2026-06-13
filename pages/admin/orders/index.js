 import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import OrderDrawer from "@/components/OrderDrawer";
import { Search, MoreVertical } from "lucide-react";

const columns = [
  { key: "pending", label: "Pending", color: "bg-yellow-50 border-yellow-200" },
  { key: "processing", label: "Processing", color: "bg-blue-50 border-blue-200" },
  { key: "shipped", label: "Shipped", color: "bg-purple-50 border-purple-200" },
  { key: "delivered", label: "Delivered", color: "bg-green-50 border-green-200" },
];

export default function AdminOrders() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [grouped, setGrouped] = useState({ pending: [], processing: [], shipped: [], delivered: [], cancelled: [] });
  const [counts, setCounts] = useState({});
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authorized) fetchOrders();
  }, [search, authorized]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.success || data.user.role !== "admin") {
        router.push("/login");
        return;
      }
      setUser(data.user);
      setAuthorized(true);
    } catch (err) {
      router.push("/login");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, limit: 100 });
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (data.success) {
        setGrouped(data.grouped);
        setCounts(data.counts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleOrderUpdated = () => {
    fetchOrders();
    setSelectedOrder(null);
  };

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar user={user} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-sm text-gray-500 mt-1">All orders, filter and search.</p>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((col) => (
              <div key={col.key} className={`rounded-xl border ${col.color} p-3`}>
                <div className="flex items-center justify-between px-2 mb-3">
                  <h3 className="font-semibold text-gray-800 text-sm">{col.label}</h3>
                  <span className="text-xs font-semibold bg-white px-2 py-0.5 rounded-full text-gray-600 border border-gray-200">
                    {counts[col.key] || 0}
                  </span>
                </div>
                <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
                  {grouped[col.key]?.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => handleOrderClick(order)}
                      className="bg-white rounded-lg border border-gray-100 p-3 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">{order.orderNumber}</span>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </div>
<p className="text-xs text-gray-500 mb-2">{order.user?.name || "Unknown"}</p>
<p className="text-xs text-gray-400 mb-2 truncate">
  {order.items?.[0]?.name}{order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
</p>                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">${order.totalPrice?.toFixed(2)}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {grouped[col.key]?.length === 0 && !loading && (
                    <p className="text-xs text-gray-400 text-center py-4">No orders</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {selectedOrder && (
        <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdated={handleOrderUpdated} />
      )}
    </div>
  );
}