import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Chào mừng trở lại, ${user.name}!`);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "seller") navigate("/seller");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng nhập">
      <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            id="login-email"
            type="email"
            className="form-input"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mật khẩu</label>
          <input
            id="login-password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button
          id="login-submit"
          type="submit"
          className="btn btn-primary btn-full btn-lg mt-1"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang đăng nhập...
            </span>
          ) : "Đăng nhập"}
        </button>
      </form>

      {/* Demo accounts */}
      <div className="px-8 pb-4 text-center">
        <p className="text-xs text-gray-400 mb-2">Tài khoản demo:</p>
        <button
          className="px-3 py-1 border border-dashed border-gray-200 rounded-full text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors"
          onClick={() => setForm({ email: "admin@shopvn.com", password: "admin123" })}
        >
          👑 Admin
        </button>
      </div>

      <div className="px-8 py-4 border-t border-gray-100 text-center text-sm text-gray-500">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </AuthLayout>
  );
}
