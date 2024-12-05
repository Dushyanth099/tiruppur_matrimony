const express = require("express");
const {
  register,
  biodata,
  login,
  getAllBiodata,
  getCurrentUserDetails,
  updateCurrentUserDetails,
  searchBiodata,
  searchCasteSubCaste,
  searchLocation,
  searchProfession,
} = require("../controllers/authController");
const { authenticateToken } = require("../controllers/authController");
const { upload } = require("../utils/upload");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/biodata", authenticateToken, upload.single("photo"), biodata);
router.get("/biodata", authenticateToken, getAllBiodata);
router.get("/current-user", authenticateToken, getCurrentUserDetails);
router.put(
  "/update-user",
  authenticateToken,
  upload.single("photo"),
  updateCurrentUserDetails
);
router.post("/biodata/search", authenticateToken, searchBiodata);
router.post("/search/casteSubCaste", authenticateToken,searchCasteSubCaste);
router.post("/search/location", authenticateToken,searchLocation);
router.post("/search/profession", authenticateToken,searchProfession);
module.exports = router;
