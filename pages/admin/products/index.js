import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatusBadge from "@/components/StatusBadge";

import {
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminProducts() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    checkAuth();
  }, []);

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    if (authorized) {
      fetchProducts();
    }
  }, [authorized, search, category, pagination.page]);

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
    } catch (error) {
      console.error(error);
      router.push("/login");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        search,
        category,
        page: pagination.page.toString(),
        limit: "10",
      });

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setPagination(
          data.pagination || {
            page: 1,
            pages: 1,
            total: 0,
          }
        );
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }

    setOpenMenu(null);
  };

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

        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Products
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage your products and inventory.
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm mb-4 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);

                  setPagination((prev) => ({
                    ...prev,
                    page: 1,
                  }));
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);

                setPagination((prev) => ({
                  ...prev,
                  page: 1,
                }));
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white"
            >
              <option value="All">All Categories</option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* Table Head */}
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {/* Loading */}
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-400"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-400"
                      >
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr
                        key={p._id}
                        className="border-t border-gray-50 hover:bg-gray-50/50"
                      >
                        {/* Product */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-gray-400">
                              {p.images?.[0]?.url ? (
                                <Image
                                  src={p.images[0].url}
                                  alt={p.name}
                                  width={36}
                                  height={36}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                "IMG"
                              )}
                            </div>

                            <span className="font-medium text-gray-900">
                              {p.name}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-3 text-gray-600">
                          {p.category}
                        </td>

                        {/* Price */}
                        <td className="px-5 py-3 text-gray-900 font-medium">
                          $
                          {p.discountPrice > 0
                            ? p.discountPrice.toFixed(2)
                            : p.price.toFixed(2)}
                        </td>

                        {/* Stock */}
                        <td
                          className={`px-5 py-3 font-medium ${
                            p.totalStock === 0
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {p.totalStock}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3">
                          <StatusBadge status={p.stockStatus} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3 text-right relative">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === p._id ? null : p._id
                              )
                            }
                            className="p-1.5 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>

                          {openMenu === p._id && (
                            <div className="absolute right-5 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 text-left">
                              <Link
                                href={`/admin/products/${p._id}/edit`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </Link>

                              <button
                                onClick={() => handleDelete(p._id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing{" "}
                {pagination.total === 0
                  ? 0
                  : (pagination.page - 1) * 10 + 1}{" "}
                to{" "}
                {Math.min(
                  pagination.page * 10,
                  pagination.total
                )}{" "}
                of {pagination.total} results
              </p>

              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Pages */}
                {Array.from(
                  { length: pagination.pages },
                  (_, i) => i + 1
                )
                  .slice(0, 5)
                  .map((pg) => (
                    <button
                      key={pg}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: pg,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        pagination.page === pg
                          ? "bg-primary-600 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                {/* Next */}
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.pages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}