const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app); // Create server using HTTP
const port = process.env.PORT || 5000;
const { Server } = require("socket.io");

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL (React app)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const activeClients = new Map(); // Store connected clients by user ID
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interests", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// MongoDB connection setup
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
  },
});
const userSockets = {};
// Attach to requests

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register the user socket with their ID
  socket.on("register", (userId) => {
    if (userId) {
      userSockets[userId] = socket.id;
      console.log(`Registered user ${userId} with socket ID ${socket.id}`);
    }
  });

  // Listen for interest events
  socket.on("send-interest", ({ senderId, recipientId }) => {
    if (userSockets[recipientId]) {
      // Emit notification to recipient
      io.to(userSockets[recipientId]).emit("new-interest", {
        message: `${senderId} sent you an interest.`,
      });
    } else {
      console.log(`Recipient with ID ${recipientId} is not connected.`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove the disconnected user from userSockets
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        console.log(`User ${userId} disconnected.`);
        break;
      }
    }
  });
});
app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  next();
});

// Start the server
server.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = { app, server, io };
module.exports.io = io;