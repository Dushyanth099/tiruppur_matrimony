const express = require("express");
const {
  register,
  login,
  biodata,
  getBiodata,
} = require("../controllers/authController");
const { upload } = require("../utils/upload");
const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

//biodata route

router.post("/biodata", biodata);

// Fetch all biodata route
router.get("/biodata", getBiodata); // GET request to fetch all biodata
// Photo upload route
router.post("/upload-photo", upload.single("photo"), biodata); // Use Multer middleware for photo upload

module.exports = router;
