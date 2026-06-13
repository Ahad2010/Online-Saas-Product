import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(router.query.search || "");
  const [category, setCategory] = useState("All");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [search, category, pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, category, page: pagination.page, limit: 12 });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);

        const cats = [...new Set(data.products.map((p) => p.category))];
        setCategories((prev) => [...new Set([...prev, ...cats])]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">All Products</h1>
        <p className="text-sm text-gray-500 mb-6">Browse our complete catalog.</p>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link key={p._id} href={`/products/${p.slug}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-sm overflow-hidden">
                {p.images?.[0]?.url ? (
                  <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  "Image"
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-0.5">{p.category}</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {p.discountPrice > 0 ? (
                    <>
                      <span className="text-sm font-bold text-primary-600">${p.discountPrice.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 line-through">${p.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-gray-900">${p.price.toFixed(2)}</span>
                  )}
                </div>
                {p.totalStock === 0 && (
                  <span className="inline-block mt-1 text-xs text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </Link>
          ))}
          {products.length === 0 && !loading && (
            <p className="col-span-4 text-center text-gray-400 py-10">No products found</p>
          )}
        </div>

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPagination((p) => ({ ...p, page: pg }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  pagination.page === pg ? "bg-primary-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {pg}
              </button>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}