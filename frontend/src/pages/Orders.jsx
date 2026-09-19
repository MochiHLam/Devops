import { useState } from "react";
import { formatPrice, formatDate, ORDER_STATUS } from "../lib/utils";
import { useOrders } from "../hooks/useOrders";

export default function Orders() {
  const { orders, loading } = useOrders();
  const [expanded, setExpanded] = useState(null);

  if (loading) return <div className="loading-center page-content"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-in">
      <div className="max-w-screen-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-5">📦 Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <div className="card empty-state py-20">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <h3 className="text-base font-semibold text-gray-500">Chưa có đơn hàng nào</h3>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const s = ORDER_STATUS[order.status] || { label: order.status, cls: "badge badge-gray" };
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className="card overflow-hidden">
                  {/* Header */}
                  <button
                    className="w-full flex justify-between items-center px-4 py-3.5 hover:bg-gray-50 transition-colors text-left border-0 bg-transparent cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                  >
                    <div>
                      <p className="text-xs text-gray-400">Đơn #{order.id}</p>
                      <p className="text-sm mt-0.5 text-gray-600">{formatDate(order.created_at, { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={s.cls}>{s.label}</span>
                      <span className="price font-bold">{formatPrice(order.total_amount)}</span>
                      <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
                    </div>
                  </button>

                  {/* Detail */}
                  {isOpen && (
                    <div className="border-t border-gray-100 slide-down">
                      <p className="px-4 py-2 text-xs text-gray-400 flex items-center gap-1">
                        📍 {order.shipping_address}
                      </p>
                      <div className="table-wrap">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Sản phẩm</th>
                              <th>SL</th>
                              <th>Đơn giá</th>
                              <th>Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(order.items || []).map((item) => (
                              <tr key={item.id}>
                                <td className="font-medium">{item.product_name}</td>
                                <td>{item.quantity}</td>
                                <td>{formatPrice(item.price_at_purchase)}</td>
                                <td className="price">{formatPrice(parseFloat(item.price_at_purchase) * item.quantity)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
