const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "notification",
  notificationSchema,
  "Notifications"
);
