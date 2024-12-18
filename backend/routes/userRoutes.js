const { authenticateToken } = require("../controllers/authController");
const { recentProfiles } = require("../controllers/UserController");
const {
  addFavorites,
  getFavorites,
  removeFavorites,
} = require("../controllers/UserController");
const express = require("express");
const router = express.Router();

router.get("/biodata/recent-profiles/", authenticateToken, recentProfiles);
router.post("/addFavorites", authenticateToken, addFavorites);
router.get("/getFavorites", authenticateToken, getFavorites);
router.post("/removeFavorites", authenticateToken, removeFavorites);

module.exports = router;
