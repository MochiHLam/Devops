import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { CATEGORIES } from "../../lib/utils";
import toast from "react-hot-toast";

const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c !== "Tất cả");

export default function AddProduct() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "Điện tử" });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (incoming) => {
    const selected = Array.from(incoming).slice(0, 5);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) return toast.error("Vui lòng điền đầy đủ thông tin");
    if (parseFloat(form.price) <= 0) return toast.error("Giá phải lớn hơn 0");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock || 0);
      formData.append("category", form.category);
      files.forEach((f) => formData.append("images", f));

      await api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Đăng sản phẩm thành công! 🎉");
      navigate("/seller/products");
    } catch (err) {
      toast.error(err.response?.data?.error || "Đăng sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content fade-in">
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">📸 Đăng sản phẩm mới</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Left: info */}
            <div className="card p-5 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-gray-700">Thông tin cơ bản</h2>

              <div className="form-group">
                <label className="form-label">Tên sản phẩm *</label>
                <input id="product-name" className="form-input" placeholder="VD: iPhone 15 Pro Max 256GB"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea className="form-textarea" placeholder="Mô tả chi tiết sản phẩm..."
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Giá (nghìn VNĐ) *</label>
                  <input id="product-price" type="number" className="form-input" placeholder="500"
                    min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  {form.price && (
                    <span className="text-xs text-primary mt-1">
                      = {new Intl.NumberFormat("vi-VN").format(parseFloat(form.price || 0) * 1000)}đ
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Số lượng kho</label>
                  <input id="product-stock" type="number" className="form-input" placeholder="0"
                    min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Danh mục *</label>
                <select id="product-category" className="form-select"
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Right: images */}
            <div className="card p-5 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-gray-700">
                Hình ảnh
                <span className="text-gray-400 font-normal ml-1">(tối đa 5 — upload lên S3)</span>
              </h2>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragging ? "border-primary bg-primary-50" : "border-gray-200 hover:border-primary/60 hover:bg-gray-50"
                }`}
              >
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                <div className="text-3xl mb-2">☁️</div>
                <p className="text-sm font-medium text-gray-500">Kéo thả hoặc click để chọn ảnh</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Tối đa 5MB/ảnh</p>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((url, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* S3 note */}
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3.5 py-2.5 text-xs text-blue-700">
                ☁️ <span>Ảnh sẽ được upload lên <strong>Amazon S3</strong> và lưu URL vào <strong>DynamoDB</strong></span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/seller/products")}>Hủy</button>
            <button id="submit-product-btn" type="submit" className="btn btn-primary btn-lg flex-1" disabled={loading}>
              {loading ? "Đang đăng sản phẩm..." : "🚀 Đăng sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
