const pool = require("../config/db");

/**
 * User Model — RDS PostgreSQL query wrappers
 */
const UserModel = {
  findByEmail: async (email) => {
    const res = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return res.rows[0] || null;
  },

  findById: async (id) => {
    const res = await pool.query(
      "SELECT id, name, email, role, avatar_url, is_active, created_at FROM users WHERE id = $1",
      [id]
    );
    return res.rows[0] || null;
  },

  create: async ({ name, email, password_hash, role = "user" }) => {
    const res = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at",
      [name, email, password_hash, role]
    );
    return res.rows[0];
  },

  findAll: async () => {
    const res = await pool.query(
      "SELECT id, name, email, role, avatar_url, is_active, created_at FROM users ORDER BY created_at DESC"
    );
    return res.rows;
  },

  toggleActive: async (id) => {
    const res = await pool.query(
      "UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, name, email, role, is_active",
      [id]
    );
    return res.rows[0] || null;
  },

  updateAvatar: async (id, avatar_url) => {
    await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [avatar_url, id]);
  },

  getStats: async () => {
    const [users, sellers, orders] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'"),
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'seller'"),
      pool.query("SELECT COUNT(*), COALESCE(SUM(total_amount), 0) FROM orders"),
    ]);
    return {
      totalUsers: parseInt(users.rows[0].count),
      totalSellers: parseInt(sellers.rows[0].count),
      totalOrders: parseInt(orders.rows[0].count),
      totalRevenue: parseFloat(orders.rows[0].coalesce),
    };
  },
};

module.exports = UserModel;
