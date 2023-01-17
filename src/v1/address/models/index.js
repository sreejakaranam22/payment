const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  address_type: {
    type: String,
    enum: ["home", "office", "other"],
    default: "home",
  },
  firstname: {
    type: String,
    minLength: 1,
    maxLength: 255,
  },
  lastname: {
    type: String,
    minLength: 1,
    maxLength: 255,
  },
  address: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  address_two: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  landmark: {
    type: String,
    maxLength: 255,
  },
  city: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  state: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  zip: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("address", addressSchema, "Addresses");
