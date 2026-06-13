import { Search, Bell, Settings } from "lucide-react";

export default function Topbar({ user }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-50 rounded-lg">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-lg">
          <Settings className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{user?.name || "Guest"}</p>
            <p className="text-xs text-gray-500">{user?.role === "admin" ? "Admin" : "Customer"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}