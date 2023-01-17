const mongoose = require("mongoose");

const healthkitSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 9999,
  },
  features: {
    type: [String],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("healthkit", healthkitSchema, "Products");
