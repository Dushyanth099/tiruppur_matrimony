const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user responding to the interest
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserBiodata",
      required: true, // The user receiving the notification (the sender of the interest)
    },
    message: {
      type: String,
      required: true, // The notification message
    },
    status: {
      type: String, // Accepted or Rejected
      required: true,
      enum: ["accepted", "rejected"],
    },
    interest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
