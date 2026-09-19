const pool = require("../config/db");
const CartModel = require("../models/cart.model");
const OrderModel = require("../models/order.model");

const OrderService = {
  /**
   * Create order from current cart — uses DB transaction
   */
  createFromCart: async ({ user_id, shipping_address }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const cartItems = await CartModel.findByUserId(user_id);
      if (cartItems.length === 0) {
        throw Object.assign(new Error("Cart is empty"), { status: 400 });
      }

      const totalAmount = cartItems
        .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
        .toFixed(2);

      const order = await OrderModel.create(client, { user_id, total_amount: totalAmount, shipping_address });

      for (const item of cartItems) {
        await OrderModel.addItem(client, {
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price_at_purchase: item.price,
          seller_id: item.seller_id,
        });
      }

      await CartModel.clearByUserId(user_id);
      await client.query("COMMIT");

      const items = await OrderModel.findItemsByOrderId(order.id);
      return { ...order, items };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};

module.exports = OrderService;
