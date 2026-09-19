const app = require("./app");

const PORT = process.env.PORT || 3000;

<<<<<<< Updated upstream
app.get("/", (req, res) => {
    res.send("Hello DevOps CI/CD!!!");
});

=======
>>>>>>> Stashed changes
app.listen(PORT, () => {
  console.log(`🚀 ShopVN API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Env: ${process.env.NODE_ENV || "development"}`);
});