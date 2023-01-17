const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  razorpay: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "failed"],
  },
});

module.exports = mongoose.model("payments", paymentSchema, "Payments");
