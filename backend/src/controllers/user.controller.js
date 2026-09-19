const pool = require("../config/db");
const { s3Client, BUCKET } = require("../config/s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

// GET /api/users — admin only
const listUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, avatar_url, is_active, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error("List users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// PATCH /api/users/:id/status — admin toggle active
const toggleUserStatus = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, name, email, role, is_active",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Toggle user status error:", err);
    res.status(500).json({ error: "Failed to update user status" });
  }
};

// GET /api/users/stats — admin dashboard stats
const getStats = async (req, res) => {
  try {
    const [usersRes, ordersRes, sellersRes] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'"),
      pool.query("SELECT COUNT(*), SUM(total_amount) FROM orders"),
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'seller'"),
    ]);

    res.json({
      totalUsers: parseInt(usersRes.rows[0].count),
      totalSellers: parseInt(sellersRes.rows[0].count),
      totalOrders: parseInt(ordersRes.rows[0].count),
      totalRevenue: parseFloat(ordersRes.rows[0].sum || 0),
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// POST /api/users/avatar — upload avatar to S3
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const key = `avatars/${req.user.id}-${uuidv4()}.${req.file.mimetype.split("/")[1]}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const avatar_url = `https://${BUCKET}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/${key}`;

    await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      avatar_url,
      req.user.id,
    ]);

    res.json({ avatar_url });
  } catch (err) {
    console.error("Upload avatar error:", err);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};

module.exports = { listUsers, toggleUserStatus, getStats, uploadAvatar };
