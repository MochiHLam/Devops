import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/utils";
import toast from "react-hot-toast";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate("/cart", { replace: true });
    return null;
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) { toast.error("Vui lòng nhập địa chỉ giao hàng"); return; }
    setLoading(true);
    try {
      await api.post("/orders", { shipping_address: address.trim() });
      await clearCart();
      toast.success("Đặt hàng thành công! 🎉");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.error || "Đặt hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content fade-in">
      <div className="max-w-screen-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-5">📋 Xác nhận đơn hàng</h1>

        <div className="grid grid-cols-1 gap-5">
          {/* Item list */}
          <div className="card">
            <div className="section-title">Sản phẩm ({items.length})</div>
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">x{item.quantity}</p>
                  </div>
                  <p className="price text-sm">{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-4 py-3 border-t border-gray-100 font-bold">
              <span>Tổng cộng</span>
              <span className="price text-base">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">📍 Địa chỉ giao hàng</h2>
            <form onSubmit={handleOrder} className="flex flex-col gap-4">
              <textarea
                id="shipping-address"
                className="form-textarea"
                placeholder="Nhập địa chỉ đầy đủ: Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
              />

              {/* Payment note */}
              <div className="flex items-center gap-2.5 bg-yellow-50 border border-yellow-200 rounded-lg px-3.5 py-3 text-sm text-yellow-800">
                💵 <span>Thanh toán khi nhận hàng (COD)</span>
              </div>

              <div className="flex gap-3">
                <button type="button" className="btn btn-ghost flex-1" onClick={() => navigate("/cart")}>
                  ← Quay lại
                </button>
                <button
                  id="place-order-btn"
                  type="submit"
                  className="btn btn-primary flex-[2] btn-lg"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "🚀 Đặt hàng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
