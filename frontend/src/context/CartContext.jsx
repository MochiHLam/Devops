import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setItems(res.data.items || []);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user, fetchCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    try {
      const res = await api.post("/cart", {
        product_id: product.product_id,
        product_name: product.name,
        price: product.price,
        quantity,
        image_url: product.image_urls?.[0] || "",
        seller_id: product.seller_id,
      });
      setItems((prev) => {
        const existing = prev.find((i) => i.product_id === product.product_id);
        if (existing) {
          return prev.map((i) =>
            i.product_id === product.product_id ? res.data : i
          );
        }
        return [...prev, res.data];
      });
      toast.success("Đã thêm vào giỏ hàng!");
    } catch {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  }, [user]);

  const updateQuantity = useCallback(async (id, quantity) => {
    try {
      const res = await api.put(`/cart/${id}`, { quantity });
      setItems((prev) => prev.map((i) => (i.id === id ? res.data : i)));
    } catch {
      toast.error("Không thể cập nhật số lượng");
    }
  }, []);

  const removeItem = useCallback(async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Đã xóa khỏi giỏ hàng");
    } catch {
      toast.error("Không thể xóa");
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await api.delete("/cart/clear");
      setItems([]);
    } catch {
      setItems([]);
    }
  }, []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, updateQuantity, removeItem, clearCart, totalItems, totalPrice, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
