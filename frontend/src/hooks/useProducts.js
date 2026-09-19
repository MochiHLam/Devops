import { useState, useEffect, useCallback } from "react";
import api from "../lib/axios";

/**
 * useProducts — fetch product list with filter support
 */
export function useProducts({ category, search } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (category && category !== "Tất cả") params.category = category;
      if (search) params.search = search;
      const res = await api.get("/products", { params });
      setProducts(res.data.products || []);
    } catch (err) {
      setError(err.response?.data?.error || "Không thể tải sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

/**
 * useSellerProducts — fetch the current seller's products
 */
export function useSellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/seller/mine");
      setProducts(res.data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, setProducts, loading, refetch: fetchProducts };
}
