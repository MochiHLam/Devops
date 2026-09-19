import { Link } from "react-router-dom";
import api from "../../lib/axios";
import { useSellerProducts } from "../../hooks/useProducts";
import { formatPrice, PLACEHOLDER_IMG } from "../../lib/utils";
import toast from "react-hot-toast";

export default function SellerProducts() {
  const { products, setProducts, loading } = useSellerProducts();

  const handleToggle = async (product) => {
    try {
      await api.put(`/products/${product.product_id}`, { is_active: !product.is_active });
      setProducts((prev) => prev.map((p) => p.product_id === product.product_id ? { ...p, is_active: !p.is_active } : p));
      toast.success(product.is_active ? "Đã ẩn sản phẩm" : "Đã hiện sản phẩm");
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
      toast.success("Đã xóa sản phẩm");
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  if (loading) return <div className="loading-center page-content"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-in">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold">📦 Quản lý sản phẩm ({products.length})</h1>
          <Link to="/seller/products/add" className="btn btn-primary">+ Thêm sản phẩm</Link>
        </div>

        <div className="card">
          {products.length === 0 ? (
            <div className="empty-state py-20">
              <h3 className="font-semibold text-gray-500">Chưa có sản phẩm nào</h3>
              <Link to="/seller/products/add" className="btn btn-primary mt-3">Đăng sản phẩm đầu tiên</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Kho</th><th>Trạng thái</th><th>Thao tác</th></tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.product_id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_urls?.[0] || PLACEHOLDER_IMG}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                          />
                          <div>
                            <p className="font-medium text-sm max-w-[180px] truncate">{p.name}</p>
                            <p className="text-[11px] text-gray-400">{p.product_id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-gray">{p.category}</span></td>
                      <td className="price">{formatPrice(p.price)}</td>
                      <td>
                        <span className={`font-semibold text-sm ${p.stock <= 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-500" : "text-green-600"}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${p.is_active ? "badge-green" : "badge-gray"}`}>
                          {p.is_active ? "Đang bán" : "Đã ẩn"}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className={`btn btn-sm ${p.is_active ? "btn-ghost" : "btn-success"}`}
                            onClick={() => handleToggle(p)}
                          >
                            {p.is_active ? "Ẩn" : "Hiện"}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p.product_id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
