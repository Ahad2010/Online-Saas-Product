import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

import {
  Package,
  AlertTriangle,
  Check,
} from "lucide-react";

export default function AdminNotifications() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.success || data.user?.role !== "admin") {
        router.push("/login");
        return;
      }

      setUser(data.user);
      setAuthorized(true);

      fetchNotifications();
    } catch (error) {
      console.error(error);
      router.push("/login");
    }
  };

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();

      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Notifications fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTERS
  // =========================
  const filters = [
    { value: "all", label: "All" },
    { value: "order", label: "Orders" },
    { value: "stock", label: "Inventory" },
  ];

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  // =========================
  // LOADING AUTH
  // =========================
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1">
        <Topbar user={user} />

        <main className="p-6 max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Stay updated with important alerts.
              </p>
            </div>

            <button
              onClick={fetchNotifications}
              className="text-sm text-primary-600 font-medium hover:text-primary-700"
            >
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.value
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {/* Loading */}
            {loading ? (
              <div className="p-12 text-center text-gray-400">
                Loading notifications...
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((n) => (
                <Link
                  key={n.id || n._id}
                  href={n.link || "#"}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      n.type === "order"
                        ? "bg-primary-50 text-primary-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {n.type === "order" ? (
                      <Package className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {n.title}
                    </p>

                    <p className="text-sm text-gray-500 mt-0.5">
                      {n.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.time).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400">
                <Check className="w-10 h-10 mx-auto mb-2 text-gray-200" />

                No notifications
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}