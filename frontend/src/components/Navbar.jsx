import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const roleBadgeCls = {
    admin:  "bg-red-100 text-red-700",
    seller: "bg-blue-100 text-blue-700",
    user:   "bg-green-100 text-green-700",
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-primary shadow-nav">
      <div className="max-w-screen-xl mx-auto h-full flex items-center gap-4 px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
          <span className="text-xl">🛒</span>
          <span className="text-xl font-black text-white tracking-tight">ShopVN</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-xl rounded overflow-hidden bg-white">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3.5 py-2 text-sm text-gray-800 bg-transparent outline-none"
          />
          <button
            type="submit"
            aria-label="Tìm kiếm"
            className="px-4 bg-accent hover:bg-accent-dark flex items-center text-white transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto shrink-0">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex flex-col items-center text-white px-2.5 py-1 rounded hover:bg-white/15 transition-colors no-underline"
            aria-label="Giỏ hàng"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-yellow-400 text-red-700 text-[10px] font-bold rounded-full px-1">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
            <span className="text-[11px] mt-0.5">Giỏ hàng</span>
          </Link>

          {/* User menu / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-white px-2.5 py-1 rounded hover:bg-white/15 transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    : <span>{user.name?.charAt(0).toUpperCase()}</span>
                  }
                </div>
                <span className="text-[11px] hidden sm:block max-w-[80px] truncate">
                  {user.name?.split(" ").pop()}
                </span>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden slide-down">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <span className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${roleBadgeCls[user.role] || "bg-gray-100 text-gray-600"}`}>
                        {user.role}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="py-1.5">
                      <Link
                        to="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline"
                      >
                        📦 Đơn hàng của tôi
                      </Link>
                      {(user.role === "seller" || user.role === "admin") && (
                        <Link
                          to="/seller"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline"
                        >
                          🏪 Quản lý cửa hàng
                        </Link>
                      )}
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline"
                        >
                          ⚙️ Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="btn btn-sm border border-white/60 text-white hover:bg-white/15 no-underline"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="btn btn-sm bg-white text-primary hover:bg-gray-100 no-underline"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
