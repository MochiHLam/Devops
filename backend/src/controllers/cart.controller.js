const pool = require("../config/db");

// GET /api/cart — get user's cart
const getCart = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1 ORDER BY added_at DESC",
      [req.user.id]
    );
    res.json({ items: result.rows });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// POST /api/cart — add or update item
const addToCart = async (req, res) => {
  try {
    const { product_id, product_name, price, quantity = 1, image_url, seller_id } = req.body;

    if (!product_id || !product_name || !price || !seller_id)
      return res.status(400).json({ error: "product_id, product_name, price, and seller_id are required" });

    // Upsert — if exists, increase quantity
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, product_name, price, quantity, image_url, seller_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [req.user.id, product_id, product_name, price, quantity, image_url, seller_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// PUT /api/cart/:id — update quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1)
      return res.status(400).json({ error: "Quantity must be at least 1" });

    const result = await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [quantity, req.params.id, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Cart item not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// DELETE /api/cart/:id — remove item
const removeFromCart = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Cart item not found" });
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
};

// DELETE /api/cart — clear all
const clearCart = async (req, res) => {
  try {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
