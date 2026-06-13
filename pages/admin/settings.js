import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Store, User, CreditCard, Truck, Bell, Users as UsersIcon, KeyRound } from "lucide-react";

const tabs = [
  { key: "general", label: "General", icon: Store },
  { key: "profile", label: "Profile", icon: User },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "users", label: "Users", icon: UsersIcon },
];

export default function AdminSettings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    storeName: "ShopHub",
    email: "support@shophub.com",
    phone: "+92 300 1234567",
    timezone: "(UTC-05:00) Eastern Time (US & Canada)",
    currency: "USD - US Dollar",
  });

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
    } catch (err) {
      router.push("/login");
    }
  };

  const handleChange = (e) => {
    setStoreSettings({ ...storeSettings, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
          <p className="text-sm text-gray-500 mb-6">Manage your account and preferences.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar tabs */}
            <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm space-y-1 h-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.key ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {activeTab === "general" && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-1">General Settings</h2>
                  <p className="text-sm text-gray-500 mb-5">Manage your account and preferences.</p>

                  {saved && (
                    <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                      Settings saved successfully!
                    </div>
                  )}

                  <form onSubmit={handleSave} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
                      <input
                        name="storeName"
                        value={storeSettings.storeName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={storeSettings.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      <input
                        name="phone"
                        value={storeSettings.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                      <select
                        name="timezone"
                        value={storeSettings.timezone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      >
                        <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                        <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                        <option>(UTC+05:00) Islamabad, Karachi</option>
                        <option>(UTC+00:00) London</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                      <select
                        name="currency"
                        value={storeSettings.currency}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      >
                        <option>USD - US Dollar</option>
                        <option>PKR - Pakistani Rupee</option>
                        <option>EUR - Euro</option>
                        <option>GBP - British Pound</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "profile" && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-1">Admin Profile</h2>
                  <p className="text-sm text-gray-500 mb-5">Your account details.</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-2xl">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-1 bg-primary-50 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">Admin</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <KeyRound className="w-4 h-4" />
                    To change your password, use the password reset feature on the login page.
                  </div>
                </div>
              )}

              {activeTab === "payment" && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-1">Payment Methods</h2>
                  <p className="text-sm text-gray-500 mb-5">Configure accepted payment methods for your store.</p>
                  <div className="space-y-3">
                    {[
                      { name: "Cash on Delivery", enabled: true },
                      { name: "Credit / Debit Card", enabled: false },
                      { name: "Bank Transfer", enabled: true },
                    ].map((m) => (
                      <div key={m.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                        <span className="text-sm font-medium text-gray-900">{m.name}</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.enabled ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {m.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-4">Card payment gateway integration coming soon.</p>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-1">Shipping Settings</h2>
                  <p className="text-sm text-gray-500 mb-5">Configure shipping rates and free shipping threshold.</p>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Standard Shipping Rate ($)</label>
                      <input type="number" defaultValue="200" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Free Shipping Threshold ($)</label>
                      <input type="number" defaultValue="5000" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <button onClick={handleSave} className="bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-1">Notification Preferences</h2>
                  <p className="text-sm text-gray-500 mb-5">Choose what alerts you want to receive.</p>
                  <div className="space-y-3">
                    {["New order received", "Low stock alerts", "Customer registrations", "Order status changes"].map((label) => (
                      <label key={label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer">
                        <span className="text-sm font-medium text-gray-900">{label}</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-1">Admin Users</h2>
                  <p className="text-sm text-gray-500 mb-5">Users with administrative access to this store.</p>
                  <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full">Admin (You)</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">To add more admins, update a user&apos;s role to &quot;admin&quot; in the database.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}