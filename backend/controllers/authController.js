const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BioData =require("../models/bioDataModel");
const router = require("../routes/auth");

exports.register = async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

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
      userName,
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
    res.status(201).json({ message: "Registration successful!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userEmail: user.userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//biodata post
exports.biodata = async (req, res) => {
  try {
    const bioData = new BioData(req.body); // Create a new BioData instance
    await bioData.save(); // Save it to the database
    res.status(201).json({ message: "BioData saved successfully!" });
  } catch (error) {
    console.error("Error saving BioData:", error);
    res.status(500).json({ error: "Failed to save BioData" });
  }
}
// New function for retrieving all biodata (GET)
exports.getBiodata = async (req, res) => {
  try {
    const biodata = await BioData.find(); // Fetch all biodata from the database
    res.status(200).json(biodata); // Return biodata in JSON format
  } catch (error) {
    console.error("Error fetching biodata:", error);
    res.status(500).json({ error: "Failed to fetch biodata" });
  }
};




