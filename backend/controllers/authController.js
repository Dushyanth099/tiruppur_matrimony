const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BioData = require("../models/bioDataModel");
const Interest = require("../models/InterestSchema");
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
      gender,
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
      gender,
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
    // Ensure the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(403).json({ message: "User authentication failed." });
    }

    // Fetch the authenticated user's gender from their biodata
    const userBiodata = await BioData.findOne({ userId: req.user.userId });

    if (!userBiodata || !userBiodata.gender) {
      return res.status(404).json({ message: "User biodata not found." });
    }

    const oppositeGender = userBiodata.gender === "Male" ? "Female" : "Male";

    // Fetch biodata entries for the opposite gender
    const biodatas = await BioData.find({ gender: oppositeGender }).populate(
      "userId",
      "userEmail name"
    );

    if (!biodatas || biodatas.length === 0) {
      return res.status(404).json({ message: "No biodata available." });
    }

    res.status(200).json(biodatas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Current User's Details
exports.getCurrentUserDetails = async (req, res) => {
  try {
    const userBiodata = await BioData.findOne({ userId: req.user.userId });
    if (!userBiodata) {
      return res.status(404).json({ message: "User biodata not found." });
    }
    res.status(200).json(userBiodata);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Update Current User's Details
exports.updateCurrentUserDetails = async (req, res) => {
  try {
    const updates = req.body;
    const photoPath = req.file ? req.file.path : null;

    const updatedBiodata = await BioData.findOneAndUpdate(
      { userId: req.user.userId },
      { ...updates, photo: photoPath || updates.photo },
      { new: true }
    );

    if (!updatedBiodata) {
      return res.status(404).json({ message: "User biodata not found." });
    }

    res
      .status(200)
      .json({ message: "Biodata updated successfully!", updatedBiodata });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.searchBiodata = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(403).json({ message: "User authentication failed." });
    }

    // Fetch the authenticated user's biodata to determine opposite gender
    const userBiodata = await BioData.findOne({ userId: req.user.userId });

    if (!userBiodata || !userBiodata.gender) {
      return res.status(404).json({ message: "User biodata not found." });
    }

    const oppositeGender = userBiodata.gender === "Male" ? "Female" : "Male";

    // Extract filter criteria from request body
    const {
      name,
      religion,
      caste,
      subCaste,
      city,
      state,
      occupation,
      ageMin,
      ageMax,
      motherTongue,
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
      annualIncomeMin,
      annualIncomeMax,
      workLocation,
    } = req.body;

    // Construct dynamic query
    const query = { gender: oppositeGender };

    if (name) query.name = { $regex: name, $options: "i" };
    if (religion) query.religion = { $regex: religion, $options: "i" };
    if (caste) query.caste = { $regex: caste, $options: "i" };
    if (subCaste) query.subCaste = { $regex: subCaste, $options: "i" };
    if (motherTongue)
      query.motherTongue = { $regex: motherTongue, $options: "i" };
    if (gothram) query.gothram = { $regex: gothram, $options: "i" };
    if (dosham) query.dosham = { $regex: dosham, $options: "i" };
    if (maritalStatus)
      query.maritalStatus = { $regex: maritalStatus, $options: "i" };
    if (height) query.height = height; // Adjust as needed
    if (familyStatus)
      query.familyStatus = { $regex: familyStatus, $options: "i" };
    if (familyType) query.familyType = { $regex: familyType, $options: "i" };
    if (familyValues)
      query.familyValues = { $regex: familyValues, $options: "i" };
    if (disability) query.disability = { $regex: disability, $options: "i" };
    if (highestEducation)
      query.highestEducation = { $regex: highestEducation, $options: "i" };
    if (employedIn) query.employedIn = { $regex: employedIn, $options: "i" };
    if (occupation) query.occupation = { $regex: occupation, $options: "i" };
    if (workLocation)
      query.workLocation = { $regex: workLocation, $options: "i" };
    if (city) query.city = { $regex: city, $options: "i" };
    if (state) query.state = { $regex: state, $options: "i" };

    // Handle age filtering based on birth date
    if (ageMin || ageMax) {
      const currentDate = new Date();
      const birthDateQuery = {};

      if (ageMin) {
        const maxBirthDate = new Date(
          currentDate.getFullYear() - ageMin,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        birthDateQuery.$lte = maxBirthDate;
      }

      if (ageMax) {
        const minBirthDate = new Date(
          currentDate.getFullYear() - ageMax,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        birthDateQuery.$gte = minBirthDate;
      }

      query.birthDate = birthDateQuery;
    }

    // Fetch filtered biodata from database
    const filteredBiodata = await BioData.find(query).populate(
      "userId",
      "userEmail name "
    );

    if (!filteredBiodata || filteredBiodata.length === 0) {
      return res.status(404).json({ message: "No matching biodata found." });
    }

    res.status(200).json(filteredBiodata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Search by caste and sub-caste
exports.searchCasteSubCaste = async (req, res) => {
  try {
    const { caste, subCaste } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(403).json({ message: "User authentication failed." });
    }

    // Fetch the authenticated user's biodata to determine opposite gender
    const userBiodata = await BioData.findOne({ userId: req.user.userId });

    if (!userBiodata || !userBiodata.gender) {
      return res.status(404).json({ message: "User biodata not found." });
    }

    const oppositeGender = userBiodata.gender === "Male" ? "Female" : "Male";

    // Construct dynamic query
    const query = { gender: oppositeGender };

    if (caste) query.caste = { $regex: caste, $options: "i" };
    if (subCaste) query.subCaste = { $regex: subCaste, $options: "i" };

    const filteredBiodata = await BioData.find(query).populate(
      "userId",
      "userEmail name"
    );

    if (!filteredBiodata || filteredBiodata.length === 0) {
      return res.status(404).json({ message: "No matching biodata found." });
    }

    res.status(200).json(filteredBiodata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search by location (city, state)
exports.searchLocation = async (req, res) => {
  try {
    const { city, state } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(403).json({ message: "User authentication failed." });
    }

    // Fetch the authenticated user's biodata to determine opposite gender
    const userBiodata = await BioData.findOne({ userId: req.user.userId });

    if (!userBiodata || !userBiodata.gender) {
      return res.status(404).json({ message: "User biodata not found." });
    }

    const oppositeGender = userBiodata.gender === "Male" ? "Female" : "Male";

    const query = { gender: oppositeGender };

    if (city) query.city = { $regex: city, $options: "i" };
    if (state) query.state = { $regex: state, $options: "i" };

    const filteredBiodata = await BioData.find(query).populate(
      "userId",
      "userEmail name"
    );

    if (!filteredBiodata || filteredBiodata.length === 0) {
      return res.status(404).json({ message: "No matching biodata found." });
    }

    res.status(200).json(filteredBiodata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search by profession (occupation, employedIn)
exports.searchProfession = async (req, res) => {
  try {
    const { occupation, employedIn } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(403).json({ message: "User authentication failed." });
    }

    // Fetch the authenticated user's biodata to determine opposite gender
    const userBiodata = await BioData.findOne({ userId: req.user.userId });

    if (!userBiodata || !userBiodata.gender) {
      return res.status(404).json({ message: "User biodata not found." });
    }

    const oppositeGender = userBiodata.gender === "Male" ? "Female" : "Male";

    const query = { gender: oppositeGender };

    if (occupation) query.occupation = { $regex: occupation, $options: "i" };
    if (employedIn) query.employedIn = { $regex: employedIn, $options: "i" };

    const filteredBiodata = await BioData.find(query).populate(
      "userId",
      "userEmail name"
    );

    if (!filteredBiodata || filteredBiodata.length === 0) {
      return res.status(404).json({ message: "No matching biodata found." });
    }

    res.status(200).json(filteredBiodata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
