const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favoriteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BioData",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
module.exports = mongoose.model("Favorite", favoriteSchema);
