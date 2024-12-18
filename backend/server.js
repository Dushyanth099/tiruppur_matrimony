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
// MongoDB connection setup
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Start the server
server.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = { app, server };
