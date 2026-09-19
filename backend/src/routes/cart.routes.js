const router = require("express").Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth");

router.use(authenticate); // all cart routes require login

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/clear", clearCart);
router.delete("/:id", removeFromCart);

module.exports = router;
