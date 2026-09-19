const router = require("express").Router();
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  myProducts,
} = require("../controllers/product.controller");
const { authenticate, requireRole } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Public routes
router.get("/", listProducts);
router.get("/seller/mine", authenticate, requireRole(["seller", "admin"]), myProducts);
router.get("/:id", getProduct);

// Seller only
router.post(
  "/",
  authenticate,
  requireRole(["seller", "admin"]),
  upload.array("images", 5),
  createProduct
);
router.put("/:id", authenticate, requireRole(["seller", "admin"]), updateProduct);
router.delete("/:id", authenticate, requireRole(["seller", "admin"]), deleteProduct);

module.exports = router;
