import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice, PLACEHOLDER_IMG } from "../lib/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loading-center page-content"><div className="spinner" /></div>;
  if (!product) return null;

  const images = product.image_urls?.length ? product.image_urls : [PLACEHOLDER_IMG];
  const isOwner = user?.id?.toString() === product.seller_id;
  const inStock = product.stock > 0;

  return (
    <div className="page-content fade-in">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-5">
          <button onClick={() => navigate("/")} className="text-primary hover:underline bg-transparent border-0 cursor-pointer p-0">Trang chủ</button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-sm">
              <img
                src={images[mainImg]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {images.map((img, i) => (
                  <img key={i} src={img} alt=""
                    onClick={() => setMainImg(i)}
                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                      i === mainImg ? "border-primary" : "border-transparent hover:border-primary/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <span className="badge badge-gray self-start">{product.category}</span>
            <h1 className="text-xl font-bold text-gray-800 leading-snug">{product.name}</h1>
            <p className="price text-2xl">{formatPrice(product.price)}</p>

            <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-600">
              🏪 <strong>{product.seller_name || "Người bán ẩn danh"}</strong>
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            )}

            <div className="text-sm">
              Kho:{" "}
              <strong className={inStock ? "text-green-600" : "text-red-500"}>
                {inStock ? `${product.stock} sản phẩm` : "Hết hàng"}
              </strong>
            </div>

            {/* Quantity */}
            {inStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Số lượng:</span>
                <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 bg-gray-50 hover:bg-gray-100 text-lg font-medium transition-colors border-0 cursor-pointer"
                  >−</button>
                  <span className="px-4 text-sm font-semibold min-w-[48px] text-center">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-9 h-9 bg-gray-50 hover:bg-gray-100 text-lg font-medium transition-colors border-0 cursor-pointer"
                  >+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <button
                id="add-to-cart-btn"
                className="btn btn-outline btn-lg flex-1"
                onClick={() => addToCart(product, qty)}
                disabled={!inStock}
              >
                🛒 Thêm vào giỏ
              </button>
              <button
                className="btn btn-primary btn-lg flex-1"
                disabled={!inStock}
                onClick={() => { addToCart(product, qty); navigate("/cart"); }}
              >
                Mua ngay
              </button>
            </div>

            {isOwner && (
              <button
                className="btn btn-ghost btn-sm self-start"
                onClick={() => navigate("/seller/products")}
              >
                ✏️ Chỉnh sửa sản phẩm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
