// discount coupon model
const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  discountInPercentage: {
    type: Number,
    required: true,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("coupon", couponSchema, "Coupons");
