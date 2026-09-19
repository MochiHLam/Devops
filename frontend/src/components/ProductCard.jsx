import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice, PLACEHOLDER_IMG } from "../lib/utils";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const image = product.image_urls?.[0] || PLACEHOLDER_IMG;
  const outOfStock = product.stock <= 0;
  const lowStock   = product.stock > 0 && product.stock <= 5;

  return (
    <div className="card group cursor-pointer fade-in flex flex-col">
      {/* Image */}
      <Link to={`/products/${product.product_id}`} className="relative aspect-square overflow-hidden bg-gray-50 no-underline block">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
          loading="lazy"
        />
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-black/55 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
            Hết hàng
          </span>
        )}
        {lowStock && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
            Còn {product.stock}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <Link
          to={`/products/${product.product_id}`}
          className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2 hover:text-primary transition-colors no-underline"
        >
          {product.name}
        </Link>

        <p className="price text-[15px]">{formatPrice(product.price)}</p>

        <div className="flex flex-wrap gap-1 text-[11px] text-gray-400">
          <span className="bg-gray-100 px-1.5 py-0.5 rounded">{product.category}</span>
          {product.seller_name && <span>🏪 {product.seller_name}</span>}
        </div>

        <button
          className="btn btn-primary btn-sm btn-full mt-auto"
          onClick={() => addToCart(product)}
          disabled={outOfStock}
        >
          {outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}
