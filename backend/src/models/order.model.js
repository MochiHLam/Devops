const pool = require("../config/db");

/**
 * Order Model — RDS PostgreSQL query wrappers
 */
const OrderModel = {
  create: async (client, { user_id, total_amount, shipping_address }) => {
    const res = await client.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address) VALUES ($1, $2, $3) RETURNING *",
      [user_id, total_amount, shipping_address]
    );
    return res.rows[0];
  },

  addItem: async (client, { order_id, product_id, product_name, quantity, price_at_purchase, seller_id }) => {
    await client.query(
      "INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_purchase, seller_id) VALUES ($1, $2, $3, $4, $5, $6)",
      [order_id, product_id, product_name, quantity, price_at_purchase, seller_id]
    );
  },

  findItemsByOrderId: async (order_id) => {
    const res = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order_id]
    );
    return res.rows;
  },

  findByUserId: async (user_id) => {
    const res = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    return res.rows;
  },

  findBySellerId: async (seller_id) => {
    const res = await pool.query(
      `SELECT DISTINCT o.*, oi.product_id, oi.product_name, oi.quantity, oi.price_at_purchase
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE oi.seller_id = $1
       ORDER BY o.created_at DESC`,
      [seller_id]
    );
    return res.rows;
  },

  findAll: async (limit = 100) => {
    const res = await pool.query(
      `SELECT o.*, u.name as buyer_name, u.email as buyer_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  },

  updateStatus: async (id, status) => {
    const res = await pool.query(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );
    return res.rows[0] || null;
  },
};

module.exports = OrderModel;
