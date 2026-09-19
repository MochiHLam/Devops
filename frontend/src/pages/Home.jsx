import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { CATEGORIES } from "../lib/utils";

export default function Home() {
  const [category, setCategory] = useState("Tất cả");
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const { products, loading } = useProducts({ category, search });

  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-light to-accent py-7">
        <div className="max-w-screen-xl mx-auto px-4">
          <h1 className="text-2xl font-black text-white mb-1.5">
            🛒 Mua sắm thả ga — Không lo về giá!
          </h1>
          <p className="text-white/85 text-sm">
            Hàng ngàn sản phẩm chất lượng từ các seller uy tín
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-all border ${
                category === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search result label */}
        {search && (
          <p className="mb-3 text-sm text-gray-500">
            Kết quả cho: <strong className="text-gray-800">"{search}"</strong>
            {" — "}{products.length} sản phẩm
          </p>
        )}

        {/* Products */}
        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <h3 className="text-base font-semibold text-gray-500">Không tìm thấy sản phẩm</h3>
            <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
