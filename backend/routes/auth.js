const express = require("express");
const {
  register,
  biodata,
  login,
  getAllBiodata,
} = require("../controllers/authController");
const { authenticateToken } = require("../controllers/authController");
const { upload } = require("../utils/upload");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/biodata", authenticateToken, upload.single("photo"), biodata);
router.get("/biodata", authenticateToken, getAllBiodata);
module.exports = router;
