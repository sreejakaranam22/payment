const order = require("./create-order");
// const schedulePickup = require("./schedule-pickup");
const rpValidator = require("./verify-payment");

exports.orderValidator = order;
exports.razorpayResponseValidator = rpValidator;
// exports.schedulePickupValidator = schedulePickup;
