const pool = require("../config/db");

// POST /api/orders — create order from cart
const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { shipping_address } = req.body;
    if (!shipping_address)
      return res.status(400).json({ error: "Shipping address is required" });

    // Get cart items
    const cartResult = await client.query(
      "SELECT * FROM cart_items WHERE user_id = $1",
      [req.user.id]
    );
    if (cartResult.rows.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const cartItems = cartResult.rows;
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, totalAmount.toFixed(2), shipping_address]
    );
    const order = orderResult.rows[0];

    // Insert order items
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_purchase, seller_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.product_id, item.product_name, item.quantity, item.price, item.seller_id]
      );
    }

    // Clear cart
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);

    await client.query("COMMIT");

    // Return order with items
    const itemsResult = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order.id]
    );
    res.status(201).json({ ...order, items: itemsResult.rows });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
};

// GET /api/orders/my — user's own orders
const myOrders = async (req, res) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    // Attach items to each order
    const result = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await pool.query(
          "SELECT * FROM order_items WHERE order_id = $1",
          [order.id]
        );
        return { ...order, items: items.rows };
      })
    );
    res.json({ orders: result });
  } catch (err) {
    console.error("My orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// GET /api/orders/seller — orders containing seller's products
const sellerOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT o.*, oi.product_id, oi.product_name, oi.quantity, oi.price_at_purchase
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE oi.seller_id = $1
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders: result.rows });
  } catch (err) {
    console.error("Seller orders error:", err);
    res.status(500).json({ error: "Failed to fetch seller orders" });
  }
};

// GET /api/orders — admin: all orders
const allOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.name as buyer_name, u.email as buyer_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 100`
    );
    res.json({ orders: result.rows });
  } catch (err) {
    console.error("All orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// PATCH /api/orders/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const result = await pool.query(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Order not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

module.exports = { createOrder, myOrders, sellerOrders, allOrders, updateStatus };
