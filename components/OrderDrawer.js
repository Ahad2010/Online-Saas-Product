import { useState } from "react";
import { X } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderDrawer({ order, onClose, onUpdated }) {
  const [activeTab, setActiveTab] = useState("details");
  const [status, setStatus] = useState(order.status);
  const [trackingId, setTrackingId] = useState(order.trackingId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingId }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      onUpdated();
    } catch (err) {
      setError("Failed to update order");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">Order #{order.orderNumber}</h2>
            <StatusBadge status={order.status} />
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex border-b border-gray-100 px-5">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-3 py-2.5 text-sm font-medium border-b-2 ${
              activeTab === "details" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-2.5 text-sm font-medium border-b-2 ${
              activeTab === "timeline" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500"
            }`}
          >
            Timeline
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Customer</h3>
                <p className="text-sm font-medium text-gray-900">{order.user?.name}</p>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress?.phone}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress?.addressLine1}, {order.shippingAddress?.addressLine2}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                  <br />
                  {order.shippingAddress?.country}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Products</h3>
                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} {item.size && `(${item.size})`} x{item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>${order.shippingPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-100">
                  <span>Total</span>
                  <span>${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Payment Status</h3>
                <span className={`text-sm font-medium ${order.isPaid ? "text-green-600" : "text-yellow-600"}`}>
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Tracking ID</label>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="TRK123456789"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Update Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white font-semibold py-2.5 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update Order"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              {order.statusHistory?.slice().reverse().map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-600 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{entry.status}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(entry.changedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {entry.note && <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>}
                  </div>
                </div>
              ))}
              {(!order.statusHistory || order.statusHistory.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No history available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}