const mongoose = require("mongoose");

dispatchDetailsSchema = mongoose.Schema({
  // warehouse marked order as dispatch_initiated
  initiated_on: {
    type: Date,
    required: true,
  },
  dispatched_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  dispatched_on: {
    type: Date,
  },
});

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    required: true,
  },
  // address: addressSchema,
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "address",
    required: true,
  },
  // pickup: pickupSchema,

  order_id: {
    type: String,
  
  },
  status: {
    type: String,
    enum: [
      "created", // order created by client
      "paid", // payment successfull
      "dispatch_initiated", // warehouse mark order as dispatch ready
      "dispatch_paused", // warehouse pause dispatch process
      "dispatch_assigned", // logistics lead will assign someone to deliver the order, warehouse will take it as dispatched order
      "dispatch_collected", // logectics member collect the order-package from warehouse
      "dispatch_completed", // client received the kit, logistics will take this as pickup request
      "cancelled", // order cancelled by client
      // "pickup_scheduled", // client schedule the pick-up timing
      // "pickup_assigned", // logistics lead will assign someone to pickup the sample
      // "pickup_collected", // sample picked up from client
      // "pickup_completed", // pickup submitted to the organisation
    ],
    default: "created",
  },
  dispatch: dispatchDetailsSchema,
  ordered_on: {
    type: Date,
  },
});

module.exports = mongoose.model("orders", orderSchema, "Orders");
