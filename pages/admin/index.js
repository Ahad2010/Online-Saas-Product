import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatusBadge from "@/components/StatusBadge";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesOverview, setSalesOverview] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

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
      fetchStats();
    } catch (err) {
      router.push("/login");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setTopProducts(data.topProducts);
        setSalesOverview(data.salesOverview || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: "+12.5%",
      positive: true,
    },
    {
      label: "Total Orders",
      value: (stats?.totalOrders || 0).toLocaleString(),
      icon: ShoppingBag,
      change: "+8.2%",
      positive: true,
    },
    {
      label: "Total Customers",
      value: (stats?.totalCustomers || 0).toLocaleString(),
      icon: Users,
      change: "+5.4%",
      positive: true,
    },
    {
      label: "Low Stock Products",
      value: (stats?.lowStockProducts || 0).toLocaleString(),
      icon: AlertTriangle,
      change: "-3.1%",
      positive: false,
    },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar user={user} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {user?.name?.split(" ")[0] || "Admin"}! Here&apos;s what&apos;s happening with your store.
              </p>
            </div>
            <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{card.label}</span>
                    <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? "..." : card.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${card.positive ? "text-green-600" : "text-red-600"}`}>
                    {card.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {card.change}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Overview - takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Sales Overview</h2>
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
              <SalesChart data={salesOverview} />
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Top Products</h2>
              <div className="space-y-3">
                {topProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                        {p.images?.[0]?.url ? (
                          <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          "IMG"
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.totalStock} in stock</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">${p.price?.toFixed(2)}</span>
                  </div>
                ))}
                {topProducts.length === 0 && !loading && (
                  <p className="text-sm text-gray-400 text-center py-4">No products yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
              <a href="/admin/orders" className="text-sm text-primary-600 font-medium hover:text-primary-700">
                View All Orders
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="py-3 text-gray-600">{order.user?.name || "Unknown"}</td>
                      <td className="py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-3 font-medium text-gray-900">${order.totalPrice?.toFixed(2)}</td>
                      <td className="py-3">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-400">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SalesChart({ data }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Build last 7 days with revenue from data, default 0
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const found = data.find((x) => x._id === dateStr);
    return { day: days[d.getDay()], revenue: found?.revenue || 0 };
  });

  const max = Math.max(...last7.map((d) => d.revenue), 1);

  return (
    <div className="h-64 flex items-end gap-2">
      {last7.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-primary-100 rounded-t-lg relative overflow-hidden flex items-end" style={{ height: "200px" }}>
            <div
              className="w-full bg-primary-500 rounded-t-lg transition-all"
              style={{ height: `${(d.revenue / max) * 100}%`, minHeight: d.revenue > 0 ? "4px" : "0px" }}
              title={`$${d.revenue.toFixed(2)}`}
            ></div>
          </div>
          <span className="text-xs text-gray-400">{d.day}</span>
        </div>
      ))}
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
          No sales data yet — place an order to see it here
        </div>
      )}
    </div>
  );
}