const { default: mongoose } = require("mongoose");

const pickupSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  pickedup_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "address",
    required: true,
  },
  kits: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "kitInstance",
  },
  date: {
    type: Date,
    // required: true,
  },
  // time: {
    // type: String,
    // enum: [
    //   "08 - 09 AM",
    //   "09 - 10 AM",
    //   "10 - 11 AM",
    //   "11 - 12 AM",
    //   "12 - 01 PM",
    //   "01 - 02 PM",
    //   "02 - 03 PM",
    //   "03 - 04 PM",
    //   "04 - 05 PM",
    //   "05 - 06 PM",
    //   "06 - 07 PM",
    // ],
    // required: true,
  // },
  collected_on: {
    type: Date,
  },
  delivered_on: {
    type: Date,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: [
      "created",
      "registered", // registered one or more kit
      "pickup_scheduled", // client schedule the pick-up timing
      "pickup_assigned", // logistics lead will assign someone to pickup the sample
      "pickup_collected", // sample picked up from client
      "pickup_completed", // pickup submitted to the organisation
      "sample_approved",
      "reports_uploaded",
      "report_uploaded",
    ],
    default: "created",
  },
});

module.exports = mongoose.model("pickups", pickupSchema, "Pickups");
