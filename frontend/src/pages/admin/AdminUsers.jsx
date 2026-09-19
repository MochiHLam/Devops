import { useState, useEffect } from "react";
import api from "../../lib/axios";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

const ROLE_BADGE = {
  user:   "badge badge-green",
  seller: "badge badge-blue",
  admin:  "badge badge-red",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/users")
      .then((r) => setUsers(r.data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (user) => {
    try {
      const res = await api.patch(`/users/${user.id}/status`);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: res.data.is_active } : u));
      toast.success(user.is_active ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-center page-content"><div className="spinner" /></div>;

  return (
    <div className="page-content fade-in">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold">👥 Quản lý người dùng ({users.length})</h1>
          <input
            className="form-input !w-60"
            placeholder="🔍 Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="text-gray-400 text-xs">#{u.id}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
                          {u.avatar_url
                            ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                            : u.name?.charAt(0).toUpperCase()
                          }
                        </div>
                        <span className="font-medium text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-sm text-gray-400">{u.email}</td>
                    <td><span className={ROLE_BADGE[u.role] || "badge badge-gray"}>{u.role}</span></td>
                    <td>
                      <span className={`badge ${u.is_active ? "badge-green" : "badge-gray"}`}>
                        {u.is_active ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400">{formatDate(u.created_at)}</td>
                    <td>
                      {u.role !== "admin" && (
                        <button
                          className={`btn btn-sm ${u.is_active ? "btn-danger" : "btn-success"}`}
                          onClick={() => handleToggle(u)}
                        >
                          {u.is_active ? "Khóa" : "Mở khóa"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
