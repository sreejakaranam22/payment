const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  firstname: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  lastname: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 150,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  blood_type: {
    type: String,
    // required: true,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  },
  // existing_disease: {
  //   type: String,
  //   required: true,
  //   minLength: 1,
  //   maxLength: 255,
  // },
  // details: {
  //   type: String,
  //   required: true,
  //   minLength: 1,
  //   maxLength: 3000,
  // },
  is_active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("member", memberSchema, "Members");
