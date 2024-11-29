const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BioData = require("../models/bioDataModel");
const { upload, storage } = require("../utils/upload");

exports.register = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Create new user
    const newUser = new User({
      userEmail,
      userPassword: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, userEmail: newUser.userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({
      message: "Registration successful!",
      userId: newUser._id,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// biodata post
exports.biodata = async (req, res) => {
 if (!req.user || !req.user.userId) {
   return res.status(403).json({ message: "User authentication failed." });
  }
  const userId = req.user.userId;
  try {
    const {
      name,
      birthDate,
      religion,
      motherTongue,
      caste,
      subCaste,
      gothram,
      dosham,
      maritalStatus,
      height,
      familyStatus,
      familyType,
      familyValues,
      disability,
      highestEducation,
      employedIn,
      occupation,
      annualIncome,
      workLocation,
      state,
      city,
      about,
    } = req.body;

    const photoPath = req.file ? req.file.path : null;

    const bioData = new BioData({
      userId,
      name,
      birthDate,
      religion,
      motherTongue,
      caste,
      subCaste,
      gothram,
      dosham,
      maritalStatus,
      height,
      familyStatus,
      familyType,
      familyValues,
      disability,
      highestEducation,
      employedIn,
      occupation,
      annualIncome,
      workLocation,
      state,
      city,
      about,
      photo: photoPath,
    });

    await bioData.save();

    await User.findByIdAndUpdate(userId, { biodata: bioData._id });

    res.status(201).json({ message: "BioData saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save BioData" });
  }
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token
console.log("Authorization header:", authHeader);
console.log("Extracted token:", token);


  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user information to the request object
  console.log("Decoded token:", decoded);
    next(); // Proceed to the next middleware
  } catch (error) {
     console.error("Token validation error:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
exports.login = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, userEmail: user.userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// getallbiodatas
exports.getAllBiodata = async (req, res) => {
  try {
    // Fetch all biodata entries, populate the user details if needed
    const biodatas = await BioData.find().populate("userId", "userEmail name"); // You can customize this based on your needs

    if (!biodatas || biodatas.length === 0) {
      return res.status(404).json({ message: "No biodata available" });
    }

    res.status(200).json(biodatas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
