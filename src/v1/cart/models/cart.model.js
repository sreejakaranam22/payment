const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  actual_price: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  kits: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "kitInstance",
  },
  is_ordered: {
    type: Boolean,
    default: false,
  },
  coupon: {
    type: String,
  },
  discountInPercentage: {
    type: Number,
  },
});

module.exports = mongoose.model("carts", cartSchema, "Carts");
