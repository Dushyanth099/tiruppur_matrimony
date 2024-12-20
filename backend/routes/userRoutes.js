const { authenticateToken } = require("../controllers/authController");
const {
  addFavorites,
  getFavorites,
  removeFavorites,
  recentProfiles,
  sendMessage,
  getMessages,
} = require("../controllers/UserController");
const express = require("express");
const router = express.Router();

router.get("/biodata/recent-profiles/", authenticateToken, recentProfiles);
router.post("/addFavorites", authenticateToken, addFavorites);
router.get("/getFavorites", authenticateToken, getFavorites);
router.post("/removeFavorites", authenticateToken, removeFavorites);
router.post("/send-message", authenticateToken, sendMessage);
router.get("/messages/:userId", authenticateToken, getMessages);
module.exports = router;
