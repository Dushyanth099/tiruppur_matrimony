const express = require("express");
const { register, login ,biodata } = require("../controllers/authController");

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

//biodata route

router.post("/biodata",biodata)



module.exports = router;
