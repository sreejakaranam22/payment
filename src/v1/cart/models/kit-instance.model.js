const mongoose = require("mongoose");

// const Product = require("../../products/models");

// defining a kit for a user
const kitInstanceSchema = mongoose.Schema({
  firstname: {
    type: String,
    // required: true,
  },
  lastname: {
    type: String,
    // required: true,
  },
  age: {
    type: Number,
    // required: true,
  },
 
  gender: {
    type: String,
    enum: ["male", "female"],
    // required: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "member",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "healthkit",
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: [
      "dispatch_completed", // kit delivered
      "registered", // schedule/d pickup
      "pickup_completed", // pickup completed from client
      "sample_approved", // sample approved by clinical partner
      "sample_rejected", // sample rejected by clinical partner
      "data_uploaded",
      "data_processing",
      "reports_uploaded",
    ],
  },
  sample_rejection_reason: {
    type: String,
  },
  timestamps: {
    pickup_completed_on: {
      type: Date,
    },
    sample_approved_on: {
      type: Date,
    },
    sample_rejected_on: {
      type: Date,
    },
    data_uploaded_on: {
      type: Date,
    },
    data_processing_started: {
      type: Date,
    },
    data_processing_ended: {
      type: Date,
    },
  },
  pickup_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pickups",
  },
  added_to_pickup: {
    type: Boolean,
    default: false,
  },
  questionnaire_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "questionnaire",
  },
  report_name: {
    type: String,
  },
});

module.exports = mongoose.model("kitInstance", kitInstanceSchema, "Kits");
