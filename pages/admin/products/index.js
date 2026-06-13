import { useEffect, useState } from "react";
import Link from "next/link";
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

  useEffect(() => {
    fetchProducts();
  }, [search, category, pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        search: search || "",
        category: category || "All",
        page: String(pagination.page),
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }

    setOpenMenu(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar user={null} />

        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Products
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your products and inventory.
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm mb-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({
                    ...p,
                    page: 1,
                  }));
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPagination((p) => ({
                  ...p,
                  page: 1,
                }));
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white"
            >
              <option value="All">All Categories</option>

              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
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

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        Loading products...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    products.map((p) => (
                      <tr
                        key={p._id}
                        className="border-t border-gray-50 hover:bg-gray-50"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                              {p.images?.[0]?.url ? (
                                <img
                                  src={p.images[0].url}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                  IMG
                                </div>
                              )}
                            </div>

                            <span className="font-medium text-gray-900">
                              {p.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3 text-gray-600">
                          {p.category}
                        </td>

                        <td className="px-5 py-3 font-medium text-gray-900">
                          $
                          {p.discountPrice > 0
                            ? p.discountPrice.toFixed(2)
                            : p.price.toFixed(2)}
                        </td>

                        <td
                          className={`px-5 py-3 font-medium ${
                            p.totalStock === 0
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {p.totalStock}
                        </td>

                        <td className="px-5 py-3">
                          <StatusBadge
                            status={p.stockStatus}
                          />
                        </td>

                        <td className="px-5 py-3 text-right relative">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === p._id
                                  ? null
                                  : p._id
                              )
                            }
                            className="p-2 rounded-lg hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>

                          {openMenu === p._id && (
                            <div className="absolute right-5 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                              <Link
                                href={`/admin/products/${p._id}/edit`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </Link>

                              <button
                                onClick={() =>
                                  handleDelete(p._id)
                                }
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                  {!loading &&
                    products.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-gray-400"
                        >
                          No products found
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * 10 + 1}
                {" "}to{" "}
                {Math.min(
                  pagination.page * 10,
                  pagination.total
                )}{" "}
                of {pagination.total} results
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      page: Math.max(1, p.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from(
                  { length: pagination?.pages || 1 },
                  (_, i) => i + 1
                )
                  .slice(0, 5)
                  .map((pg) => (
                    <button
                      key={pg}
                      onClick={() =>
                        setPagination((p) => ({
                          ...p,
                          page: pg,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        pagination.page === pg
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                <button
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      page: Math.min(
                        p.pages,
                        p.page + 1
                      ),
                    }))
                  }
                  disabled={
                    pagination.page ===
                    pagination.pages
                  }
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"
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