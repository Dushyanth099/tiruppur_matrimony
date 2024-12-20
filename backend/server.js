const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app); // Create server using HTTP
const port = process.env.PORT || 5000;
const Message = require("./models/MessageSchema");
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
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files
app.use(express.urlencoded({ extended: true }));

// socket connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend URL
    methods: ["GET", "POST"],
  },
});
// Sockets
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a user's personal room (based on their ID)
  socket.on("joinUser", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room.`);
  });

  // Handle sending messages
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    if (!message || !receiverId || !senderId) {
      console.error("Missing senderId, receiverId, or message");
      console.log("Socket sendMessage data:", {
        senderId,
        receiverId,
        message,
      });
      return;
    }

    try {
      // Save message to the database
      const newMessage = new Message({
        senderId,
        receiverId,
        message: message.trim(),
      });
      await newMessage.save();
      console.log("Message Saved:", newMessage);
      // Emit message to the sender and  receiver's room
      io.to(senderId).emit("receiveMessage", newMessage);
      io.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
// MongoDB connection setup
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Start the server
server.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = { app, server, io };
