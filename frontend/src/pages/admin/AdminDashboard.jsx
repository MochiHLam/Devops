import { useState } from "react";
import api from "../../lib/axios";
import { useAllOrders } from "../../hooks/useOrders";
import { formatPrice, formatDate, ORDER_STATUS } from "../../lib/utils";

const STAT_ITEMS = (stats) => [
  { label: "Người dùng", value: stats?.totalUsers || 0,   icon: "👤", bg: "bg-blue-50",   text: "text-blue-600" },
  { label: "Người bán",  value: stats?.totalSellers || 0, icon: "🏪", bg: "bg-purple-50", text: "text-purple-600" },
  { label: "Đơn hàng",  value: stats?.totalOrders || 0,  icon: "📦", bg: "bg-amber-50",  text: "text-amber-600" },
  { label: "Doanh thu",  value: formatPrice(stats?.totalRevenue || 0), icon: "💰", bg: "bg-green-50", text: "text-green-600" },
];

export default function AdminDashboard() {
  const { orders, setOrders, loading } = useAllOrders();
  const [stats] = useState(null);

  const handleStatus = async (orderId, status) => {
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
        <h1 className="text-2xl font-bold mb-6">⚙️ Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {STAT_ITEMS(stats).map((s) => (
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

        {/* All orders */}
        <div className="card">
          <div className="section-title">Tất cả đơn hàng ({orders.length})</div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Đơn #</th><th>Người mua</th><th>Email</th><th>Tổng tiền</th><th>Trạng thái</th><th>Địa chỉ</th><th>Ngày</th><th>Cập nhật</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const s = ORDER_STATUS[o.status] || { label: o.status, cls: "badge badge-gray" };
                  return (
                    <tr key={o.id}>
                      <td className="text-gray-400 text-xs">#{o.id}</td>
                      <td className="font-medium">{o.buyer_name}</td>
                      <td className="text-xs text-gray-400">{o.buyer_email}</td>
                      <td className="price">{formatPrice(o.total_amount)}</td>
                      <td><span className={s.cls}>{s.label}</span></td>
                      <td className="text-xs text-gray-400 max-w-[140px] truncate">{o.shipping_address}</td>
                      <td className="text-xs text-gray-400">{formatDate(o.created_at)}</td>
                      <td>
                        <select
                          className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-primary"
                          value={o.status}
                          onChange={(e) => handleStatus(o.id, e.target.value)}
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
        </div>
      </div>
    </div>
  );
}
