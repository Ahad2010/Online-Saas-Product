import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AdminAnalytics() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

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
      fetchAnalytics();
    } catch (err) {
      router.push("/login");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (data.success) setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  const revenueChange = analytics?.revenueChangePercent ?? 0;
  const ordersChange = analytics?.ordersChangePercent ?? 0;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar user={user} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-sm text-gray-500 mt-1">Track and analyze your store performance.</p>
            </div>
            <span className="text-sm text-gray-500 px-4 py-2 bg-white border border-gray-200 rounded-lg">This Month</span>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${(analytics?.totalRevenue || 0).toLocaleString()}</p>
              <p className={`text-xs font-medium mt-2 ${revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {revenueChange >= 0 ? "+" : ""}{revenueChange.toFixed(1)}% vs last month
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Orders</p>
              <p className="text-2xl font-bold text-gray-900">{(analytics?.totalOrders || 0).toLocaleString()}</p>
              <p className={`text-xs font-medium mt-2 ${ordersChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {ordersChange >= 0 ? "+" : ""}{ordersChange.toFixed(1)}% vs last month
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{(analytics?.totalCustomers || 0).toLocaleString()}</p>
              <p className="text-xs font-medium mt-2 text-gray-400">All time</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(analytics?.conversionRate || 0).toFixed(2)}%</p>
              <p className="text-xs font-medium mt-2 text-gray-400">Orders / Customers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Overview */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Revenue Overview (Last 7 Days)</h2>
              <RevenueChart data={analytics?.salesOverview || []} loading={loading} />
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Orders by Status</h2>
              <StatusBreakdown data={analytics?.statusBreakdown || []} loading={loading} />
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mt-6">
            <h2 className="font-semibold text-gray-900 mb-4">Top Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Units Sold</th>
                    <th className="pb-3 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.topProducts?.map((p) => (
                    <tr key={p._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="py-3 text-gray-600">{p.category}</td>
                      <td className="py-3 text-gray-900">{p.unitsSold}</td>
                      <td className="py-3 font-semibold text-gray-900">${p.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                  {(!analytics?.topProducts || analytics.topProducts.length === 0) && !loading && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">
                        No sales data yet
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

function RevenueChart({ data, loading }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const found = data.find((x) => x._id === dateStr);
    return { day: days[d.getDay()], revenue: found?.revenue || 0 };
  });
  const max = Math.max(...last7.map((d) => d.revenue), 1);

  return (
    <div className="h-56 flex items-end gap-2 relative">
      {last7.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-primary-100 rounded-t-lg relative overflow-hidden flex items-end" style={{ height: "180px" }}>
            <div
              className="w-full bg-primary-500 rounded-t-lg transition-all"
              style={{ height: `${(d.revenue / max) * 100}%`, minHeight: d.revenue > 0 ? "4px" : "0px" }}
              title={`$${d.revenue.toFixed(2)}`}
            ></div>
          </div>
          <span className="text-xs text-gray-400">{d.day}</span>
        </div>
      ))}
      {data.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">No data yet</div>
      )}
    </div>
  );
}

function StatusBreakdown({ data, loading }) {
  const colors = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return <div className="h-56 flex items-center justify-center text-sm text-gray-400">No orders yet</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex h-4 rounded-full overflow-hidden">
        {data.map((d) => (
          <div
            key={d._id}
            className={colors[d._id] || "bg-gray-300"}
            style={{ width: `${(d.count / total) * 100}%` }}
            title={`${d._id}: ${d.count}`}
          ></div>
        ))}
      </div>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d._id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${colors[d._id] || "bg-gray-300"}`}></span>
              <span className="text-gray-700 capitalize">{d._id}</span>
            </div>
            <span className="font-semibold text-gray-900">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}