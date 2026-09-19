const pool = require("../config/db");

/**
 * Cart Model — RDS PostgreSQL query wrappers
 */
const CartModel = {
  findByUserId: async (user_id) => {
    const res = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1 ORDER BY added_at DESC",
      [user_id]
    );
    return res.rows;
  },

  upsert: async ({ user_id, product_id, product_name, price, quantity, image_url, seller_id }) => {
    const res = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, product_name, price, quantity, image_url, seller_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [user_id, product_id, product_name, price, quantity, image_url, seller_id]
    );
    return res.rows[0];
  },

  updateQuantity: async (id, user_id, quantity) => {
    const res = await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [quantity, id, user_id]
    );
    return res.rows[0] || null;
  },

  deleteItem: async (id, user_id) => {
    const res = await pool.query(
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, user_id]
    );
    return res.rows[0] || null;
  },

  clearByUserId: async (user_id) => {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [user_id]);
  },
};

module.exports = CartModel;
