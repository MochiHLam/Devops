import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice, PLACEHOLDER_IMG } from "../lib/utils";

export default function Cart() {
  const { items, loading, updateQuantity, removeItem, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="loading-center page-content"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-in">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-5">🛒 Giỏ hàng ({totalItems})</h1>

        {items.length === 0 ? (
          <div className="card empty-state py-20">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
            </svg>
            <h3 className="text-base font-semibold text-gray-500">Giỏ hàng trống</h3>
            <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>Mua sắm ngay</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Cart items */}
            <div className="card divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-4">
                  <img
                    src={item.image_url || PLACEHOLDER_IMG}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-snug truncate">{item.product_name}</p>
                    <p className="price mt-1">{formatPrice(item.price)}</p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                        <button
                          onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                          className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-base font-medium border-0 cursor-pointer transition-colors"
                        >−</button>
                        <span className="px-3 text-sm font-semibold min-w-[36px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-base font-medium border-0 cursor-pointer transition-colors"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-400 hover:text-red-600 bg-transparent border-0 cursor-pointer transition-colors"
                      >
                        🗑 Xóa
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="price text-sm font-bold">{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="card self-start p-5 flex flex-col gap-3">
              <h2 className="font-bold text-base text-gray-800 pb-3 border-b border-gray-100">Tóm tắt đơn hàng</h2>

              <div className="flex justify-between text-sm text-gray-500">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span className="price">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-semibold">Miễn phí</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between font-bold text-base">
                <span>Tổng cộng</span>
                <span className="price text-lg">{formatPrice(totalPrice)}</span>
              </div>

              <button
                id="checkout-btn"
                className="btn btn-primary btn-full btn-lg mt-1"
                onClick={() => navigate("/checkout")}
              >
                Tiến hành thanh toán 🚀
              </button>
              <button className="btn btn-ghost btn-full btn-sm" onClick={() => navigate("/")}>
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
