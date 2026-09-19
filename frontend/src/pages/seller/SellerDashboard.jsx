import { Link } from "react-router-dom";
import api from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import { useSellerProducts } from "../../hooks/useProducts";
import { useSellerOrders } from "../../hooks/useOrders";
import { formatPrice, formatDate, ORDER_STATUS } from "../../lib/utils";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { products } = useSellerProducts();
  const { orders, setOrders, loading } = useSellerOrders();

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + parseFloat(o.price_at_purchase || 0) * (o.quantity || 1), 0);

  const stats = [
    { label: "Sản phẩm", value: products.length, icon: "📦", bg: "bg-blue-50",   text: "text-blue-600" },
    { label: "Đơn hàng", value: orders.length,   icon: "🛒", bg: "bg-purple-50", text: "text-purple-600" },
    { label: "Đang chờ", value: orders.filter((o) => o.status === "pending").length, icon: "⏳", bg: "bg-amber-50", text: "text-amber-600" },
    { label: "Doanh thu", value: formatPrice(totalRevenue), icon: "💰", bg: "bg-green-50", text: "text-green-600" },
  ];

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    } catch {
      // silent
    }
  };

  if (loading) return <div className="loading-center page-content"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-in">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">🏪 Cửa hàng của tôi</h1>
            <p className="text-sm text-gray-400 mt-1">Xin chào, <strong>{user?.name}</strong>!</p>
          </div>
          <Link to="/seller/products/add" className="btn btn-primary">
            + Đăng sản phẩm
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.text} flex items-center justify-center text-2xl shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className={`text-lg font-bold ${s.text}`}>{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="card">
          <div className="section-title">
            Đơn hàng gần đây
            <Link to="/seller/products" className="ml-auto text-xs text-primary hover:underline font-normal">
              Quản lý sản phẩm →
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="empty-state">Chưa có đơn hàng nào</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Đơn #</th><th>Sản phẩm</th><th>SL</th><th>Giá</th><th>Trạng thái</th><th>Ngày</th><th>Cập nhật</th></tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((o) => {
                    const s = ORDER_STATUS[o.status] || { label: o.status, cls: "badge badge-gray" };
                    return (
                      <tr key={`${o.id}-${o.product_id}`}>
                        <td className="text-gray-400 text-xs">#{o.id}</td>
                        <td className="max-w-[160px] truncate font-medium">{o.product_name}</td>
                        <td>{o.quantity}</td>
                        <td className="price">{formatPrice(o.price_at_purchase)}</td>
                        <td><span className={s.cls}>{s.label}</span></td>
                        <td className="text-xs text-gray-400">{formatDate(o.created_at)}</td>
                        <td>
                          <select
                            className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-primary"
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          >
                            {Object.entries(ORDER_STATUS).map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
