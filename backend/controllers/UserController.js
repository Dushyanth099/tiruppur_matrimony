const BioData = require("../models/bioDataModel");
const Favorite = require("../models/FavoriteSchema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.recentProfiles = async (req, res) => {
  try {
    console.log("Fetching recent profiles for user:", req.user);

    // Ensure user is authenticated
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: "User authentication failed." });
    }

    // Fetch the authenticated user's biodata and gender
    const userBiodata = await BioData.findOne({ userId: userId });

    if (!userBiodata || !userBiodata.gender) {
      return res.status(404).json({ message: "User biodata not found." });
    }

    // Determine opposite gender
    const oppositeGender = userBiodata.gender === "Male" ? "Female" : "Male";

    // Fetch recent profiles of the opposite gender, sorted by creation time
    const recentProfiles = await BioData.find({
      userId: { $ne: userId }, // Exclude current user
      gender: oppositeGender, // Filter by opposite gender
    })
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(10); // Limit to 10 profiles

    // Respond with the profiles
    res.status(200).json({ profiles: recentProfiles });
  } catch (error) {
    console.error("Error fetching recent profiles:", error.message);
    res.status(500).json({
      message: "Failed to fetch profiles.",
      error: error.message,
    });
  }
};
// Add a user to favorites
exports.addFavorites = async (req, res) => {
  try {
    const { favoriteId } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(favoriteId)) {
      return res.status(400).json({ message: "Invalid favorite ID format." });
    }

    const existingFavorite = await Favorite.findOne({ userId, favoriteId });
    if (existingFavorite) {
      return res.status(400).json({ message: "Already added to favorites." });
    }

    const newFavorite = new Favorite({ userId, favoriteId });
    await newFavorite.save();

    res.status(200).json({ message: "Added to favorites successfully." });
  } catch (err) {
    console.error("Error adding to favorites:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;

    const favorites = await Favorite.find({ userId }).populate(
      "favoriteId",
      "name gender  birthDate photo religion motherTongue caste subCaste  maritalStatus height familyStatus familyValues familyType  highestEducation employedIn annualIncome workLocation about  state city occupation userEmail"
    );

    if (!favorites || favorites.length === 0) {
      return res.status(404).json({ message: "No favorites found." });
    }

    const favoriteDetails = favorites.map((fav) => ({
      _id: fav.favoriteId._id,
      name: fav.favoriteId.name,
      gender: fav.favoriteId.gender,
      birthDate: fav.favoriteId.birthDate,
      religion: fav.favoriteId.religion,
      motherTongue: fav.favoriteId.motherTongue,
      caste: fav.favoriteId.caste,
      subCaste: fav.favoriteId.subCaste,
      gothram: fav.favoriteId.gothram,
      dosham: fav.favoriteId.dosham,
      maritalStatus: fav.favoriteId.maritalStatus,
      height: fav.favoriteId.height,
      familyStatus: fav.favoriteId.familyStatus,
      familyType: fav.favoriteId.familyType,
      familyValues: fav.favoriteId.familyValues,
      disability: fav.favoriteId.disability,
      highestEducation: fav.favoriteId.highestEducation,
      employedIn: fav.favoriteId.employedIn,
      occupation: fav.favoriteId.occupation,
      annualIncome: fav.favoriteId.annualIncome,
      workLocation: fav.favoriteId.workLocation,
      state: fav.favoriteId.state,
      city: fav.favoriteId.city,
      about: fav.favoriteId.about,
      photo: fav.favoriteId.photo,
    }));

    res.status(200).json({ favorites: favoriteDetails });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.removeFavorites = async (req, res) => {
  try {
    const { favoriteId } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(favoriteId)) {
      return res.status(400).json({ message: "Invalid favorite ID format." });
    }

    const favorite = await Favorite.findOneAndDelete({ userId, favoriteId });
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found." });
    }

    res.status(200).json({ message: "Removed from favorites successfully." });
  } catch (err) {
    console.error("Error removing from favorites:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};