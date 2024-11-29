const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  biodata: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BioData",
    required: false, // bioData is optional until it's filled
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
