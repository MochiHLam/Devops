const router = require("express").Router();
const { createOrder, myOrders, sellerOrders, allOrders, updateStatus } = require("../controllers/order.controller");
const { authenticate, requireRole } = require("../middlewares/auth");

router.use(authenticate);

router.post("/", createOrder);
router.get("/my", myOrders);
router.get("/seller", requireRole(["seller", "admin"]), sellerOrders);
router.get("/", requireRole("admin"), allOrders);
router.patch("/:id/status", requireRole(["seller", "admin"]), updateStatus);

module.exports = router;
