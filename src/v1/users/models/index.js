const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    maxLength: 255,
  },
  password: {
    type: String,
    // required: true,
    minLength: 1,
    maxLength: 255,
    // select: false,
  },
  resetLink: {
    type: String,
    default: ''
  },
  phone: {
    type: Number,
  },
  image: {
    type: String,
  },
  is_active: {
    type: Number,
    default: 1,
  },
  is_verified: {
    type: Number,
    default: 0,
  },
  auth_google: {
    type: Number,
    default: 0,
  },
  auth_facebook: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: [
      "client",
      "admin",
      "logistics-lead",
      "logistics-member",
      "warehouse",
      "clinical",
      "ai",
    ],
    default: "client",
  },
  otp: { type: Number },
  otpExpireTime: { type: Date },
  phone: {
    type: Number,
  },
  created_on: {
    type: Date,
  },
});

// encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// copare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("user", userSchema, "Users");
