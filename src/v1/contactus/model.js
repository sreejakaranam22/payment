const mongoose = require("mongoose");

const contactusSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  email: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  message: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
});

module.exports = mongoose.model("contactus", contactusSchema, "ContactUs");
