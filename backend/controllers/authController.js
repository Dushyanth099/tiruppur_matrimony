const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BioData = require("../models/bioDataModel");
const { upload, storage } = require("../utils/upload");
const Interest = require("../models/InterestSchema");
const Notification = require("../models/NotificationSchema");
const { ObjectId } = require("mongodb");

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

exports.sendInterest = async (req, res) => {
  try {
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    const senderId = req.user?.userId; // Get sender ID from logged-in user context
    const { receiverId } = req.body; // Get receiver ID from request body
    console.log("Decoded token (req.user):", req.user);

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ message: "Sender and receiver IDs are required" });
    }
    console.log("receiverId type:", typeof receiverId);
    console.log("Sender ID:", senderId);
    console.log("receiverId value:", receiverId);

    // Validate receiverId format
    if (!ObjectId.isValid(receiverId)) {
      console.error("Invalid receiver ID format:", receiverId);
      return res.status(400).json({ message: "Invalid receiver ID format." });
    }

    console.log("Searching for receiver with ID:", receiverId);

    const receiver = await User.findOne({ biodata: new ObjectId(receiverId) });
    console.log("Receiver found:", receiver);

    if (!receiver) {
      console.error("Receiver not found for ID:", receiverId);
      return res.status(404).json({ message: "Receiver not found." });
    }

    // Check if interest already exists
    const existingInterest = await Interest.findOne({
      sender: senderId,
      receiver: receiver.biodata, // Use receiver's biodata field
    });

    if (existingInterest) {
      return res
        .status(400)
        .json({ message: "Interest has already been sent to this user." });
    }

    // Create a new interest
    const interest = new Interest({
      sender: senderId,
      receiver: receiver.biodata, // Link to biodata field
    });
    await interest.save();

    res.status(200).json({ message: "Interest sent successfully." });
  } catch (error) {
    console.error("Error sending interest:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.respondInterest = async (req, res) => {
  try {
    const userId = req.user?.userId; // Extract current user's ID from token
    const { interestId, response } = req.body; // Extract interest ID and response

    if (!interestId || !response) {
      return res
        .status(400)
        .json({ message: "Interest ID and response are required." });
    }

    // Validate response type
    if (!["accepted", "rejected"].includes(response)) {
      return res.status(400).json({ message: "Invalid response type." });
    }

    // Fetch the user's biodata ID to match the Interest's receiver
    const user = await User.findById(userId).select("biodata");
    if (!user || !user.biodata) {
      return res
        .status(404)
        .json({ message: "User biodata not found for authorization." });
    }

    const userBiodataId = user.biodata;

    // Find the interest document
    const interest = await Interest.findById(interestId);
    if (!interest) {
      return res.status(404).json({ message: "Interest not found." });
    }

    // Authorization: Ensure the logged-in user is the receiver
    if (interest.receiver.toString() !== userBiodataId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to respond to this interest.",
      });
    }

    // Update the interest status
    interest.status = response;
    await interest.save();

    // Notify the sender
    const sender = await User.findById(interest.sender);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found." });
    }
    // Create a notification for the sender
    const notification = new Notification({
      sender: userId, // Receiver is responding
      receiver: sender._id, // Sender gets the notification
      message: `Your interest has been ${response} by the user.`,
      status: response, // Accepted or rejected
      interest: interestId, // Link to the interest
    });

    await notification.save();

    res.status(200).json({ message: `Interest ${response} successfully.` });
  } catch (error) {
    console.error("Error responding to interest:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.notifications = async (req, res) => {
  try {
    const userId = req.user?.userId; // Extract the logged-in user's ID from the token

    if (!userId) {
      return res.status(403).json({ message: "User authentication failed." });
    }

    // Fetch the logged-in user's biodata ID
    const user = await User.findById(userId).select("biodata");
    if (!user || !user.biodata) {
      return res.status(404).json({ message: "User biodata not found." });
    }
    const receiverBiodataId = user.biodata;

    console.log("Logged-in user ID:", userId);
    console.log("Logged-in user's biodata ID:", receiverBiodataId);

    // Fetch interests where the user is the receiver
    const receivedNotifications = await Interest.find({
      receiver: receiverBiodataId,
    })
      .populate("sender", "userEmail") // Populate sender details (userEmail only)
      .sort({ createdAt: -1 }); // Sort notifications by most recent
    console.log("Fetched notifications:", receivedNotifications);

    // Fetch notifications where the user is the sender (i.e., response to their interest)
    const sentNotifications = await Notification.find({ receiver: userId }) // receiver is sender's ID in this case
      .populate("sender", "userEmail") // Populate the responding user details
      .sort({ createdAt: -1 });

    console.log("Received notifications:", receivedNotifications);
    console.log("Sent notifications:", sentNotifications);
    // Combine both received and sent notifications
    const notifications = [
      ...receivedNotifications.map((interest) => ({
        _id: interest._id,
        type: "interest",
        sender: interest.sender,
        status: interest.status,
        createdAt: interest.createdAt,
      })),
      ...sentNotifications.map((notif) => ({
        _id: notif._id,
        type: "response",
        sender: notif.sender,
        message: notif.message,
        status: notif.status,
        createdAt: notif.createdAt,
      })),
    ];

    // Sort combined notifications by creation time (descending)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("Combined notifications:", notifications);

    // Return notifications or an empty array
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
