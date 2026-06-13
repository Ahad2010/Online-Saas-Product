import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StorefrontLayout from "@/components/StorefrontLayout";
import { User, MapPin, Package, Plus, Trash2 } from "lucide-react";

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "Pakistan",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setShowAddressForm(false);
        setAddressForm({ label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "Pakistan" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Remove this address?")) return;
    try {
      const res = await fetch(`/api/account/addresses?id=${addressId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <StorefrontLayout>
        <div className="max-w-5xl mx-auto px-6 py-20 text-center text-gray-400">Loading...</div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Account</h1>
        <p className="text-sm text-gray-500 mb-6">Manage your profile, addresses, and orders.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1">
              {[
                { key: "profile", label: "Profile", icon: User },
                { key: "addresses", label: "Addresses", icon: MapPin },
                { key: "orders", label: "Orders", icon: Package, href: "/orders" },
              ].map((tab) => {
                const Icon = tab.icon;
                if (tab.href) {
                  return (
                    <a key={tab.key} href={tab.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      <Icon className="w-4 h-4" /> {tab.label}
                    </a>
                  );
                }
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
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-2xl">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Full Name</label>
                    <p className="text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email</label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Phone</label>
                    <p className="text-gray-900">{user?.phone || "Not set"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Member Since</label>
                    <p className="text-gray-900">
                      {user?.createdAt && new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Saved Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="w-4 h-4" /> Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input name="label" placeholder="Label (Home/Work)" value={addressForm.label} onChange={handleAddressChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input name="fullName" placeholder="Full Name" required value={addressForm.fullName} onChange={handleAddressChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input name="phone" placeholder="Phone" required value={addressForm.phone} onChange={handleAddressChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input name="addressLine1" placeholder="Address Line 1" required value={addressForm.addressLine1} onChange={handleAddressChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input name="city" placeholder="City" required value={addressForm.city} onChange={handleAddressChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input name="state" placeholder="State/Province" required value={addressForm.state} onChange={handleAddressChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input name="postalCode" placeholder="Postal Code" required value={addressForm.postalCode} onChange={handleAddressChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input name="country" placeholder="Country" required value={addressForm.country} onChange={handleAddressChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <button type="submit" disabled={savingAddress} className="bg-primary-600 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-primary-700 disabled:opacity-60">
                      {savingAddress ? "Saving..." : "Save Address"}
                    </button>
                  </form>
                )}

                {user?.addresses?.length > 0 ? (
                  <div className="space-y-3">
                    {user.addresses.map((addr) => (
                      <div key={addr._id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl">
                        <div>
                          <span className="inline-block bg-primary-50 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full mb-1.5">{addr.label}</span>
                          <p className="text-sm font-medium text-gray-900">{addr.fullName} · {addr.phone}</p>
                          <p className="text-sm text-gray-500">
                            {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                          </p>
                        </div>
                        <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8">No saved addresses yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}