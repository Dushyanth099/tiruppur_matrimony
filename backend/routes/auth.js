const express = require("express");
const {
  register,
  login,
  biodata,
  getBiodata,
} = require("../controllers/authController");

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

//biodata route

router.post("/biodata", biodata);

// Fetch all biodata route
router.get("/biodata", getBiodata); // GET request to fetch all biodata


module.exports = router;
