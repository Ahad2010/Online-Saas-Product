const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  in_stock: "bg-green-50 text-green-700 border-green-200",
  low_stock: "bg-yellow-50 text-yellow-700 border-yellow-200",
  out_of_stock: "bg-red-50 text-red-700 border-red-200",
};

const labels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        statusStyles[status] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}