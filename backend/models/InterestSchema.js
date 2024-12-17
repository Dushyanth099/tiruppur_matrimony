const mongoose = require("mongoose");

const InterestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserBiodata",
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "accepted", "rejected"],
    default: "sent",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Interest", InterestSchema);
