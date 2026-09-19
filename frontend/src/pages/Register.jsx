import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
import toast from "react-hot-toast";

const ROLES = [
  { value: "user",   label: "🛍️ Người mua",  desc: "Mua sắm sản phẩm" },
  { value: "seller", label: "🏪 Người bán",   desc: "Đăng bán sản phẩm" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Mật khẩu phải có ít nhất 6 ký tự"); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success("Đăng ký thành công!");
      if (user.role === "seller") navigate("/seller");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản">
      <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">
        <div className="form-group">
          <label className="form-label">Họ và tên</label>
          <input id="reg-name" type="text" className="form-input" placeholder="Nguyễn Văn A"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input id="reg-email" type="email" className="form-input" placeholder="email@example.com"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>

        <div className="form-group">
          <label className="form-label">Mật khẩu</label>
          <input id="reg-password" type="password" className="form-input" placeholder="Tối thiểu 6 ký tự"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>

        {/* Role selector */}
        <div className="form-group">
          <label className="form-label">Loại tài khoản</label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <label
                key={r.value}
                className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  form.role === r.value
                    ? "border-primary bg-primary-50"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <input type="radio" name="role" value={r.value} className="sr-only"
                  checked={form.role === r.value}
                  onChange={() => setForm({ ...form, role: r.value })} />
                <span className="text-base font-semibold">{r.label}</span>
                <span className="text-[11px] text-gray-400 mt-0.5">{r.desc}</span>
              </label>
            ))}
          </div>
        </div>

        <button id="reg-submit" type="submit" className="btn btn-primary btn-full btn-lg mt-1" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>

      <div className="px-8 py-4 border-t border-gray-100 text-center text-sm text-gray-500">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
      </div>
    </AuthLayout>
  );
}
