/**
 * socket.js — WebSocket / Socket.io setup
 * Placeholder for real-time features (order status updates, notifications)
 *
 * Usage (in server.js when needed):
 *   const { initSocket } = require("./socket");
 *   const server = http.createServer(app);
 *   initSocket(server);
 */

let io = null;

const initSocket = (httpServer) => {
  const { Server } = require("socket.io");

  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  console.log("✅ Socket.io initialized");
  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
