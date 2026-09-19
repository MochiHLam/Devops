const router = require("express").Router();
const { listUsers, toggleUserStatus, getStats, uploadAvatar } = require("../controllers/user.controller");
const { authenticate, requireRole } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Admin routes
router.get("/", authenticate, requireRole("admin"), listUsers);
router.get("/stats", authenticate, requireRole("admin"), getStats);
router.patch("/:id/status", authenticate, requireRole("admin"), toggleUserStatus);

// Any authenticated user
router.post("/avatar", authenticate, upload.single("avatar"), uploadAvatar);

module.exports = router;
