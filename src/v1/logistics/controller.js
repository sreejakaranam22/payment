const Users = require("../users/models");
const { Orders } = require("../orders/models");
const Pickups = require("../pickups/model");
const BadRequestError = require("../../errors/bad-request");
const { dispatchAssignValidator } = require("./validator");
const { default: mongoose } = require("mongoose");
const kitInstanceModel = require("../cart/models/kit-instance.model");

/**
 * Returns all logistics user
 * @method GET
 * @api /logistics/members
 * @access logistics-lead
 */
exports.allMembers = async (req, res) => {
  const logisticsMember = await Users.find(
    { role: /logistics/i },
    { _id: 1, fullname: 1 }
  );

  return res.json({ status: "success", logisticsMember });
};

/**
 * Returns the data required for logistics member dashboard
 * @method GET
 * @api /logistics/dashboard/member
 * @access logistics-member
 */
exports.memberDashboardController = async (req, res) => {
  const logisticsMember = await Users.find(
    { role: /logistics/i },
    { fullname: 1, email: 1, created_on: 1, phone: 1 }
  );

  const ordersCount = await Orders.aggregate([
    {
      $match: {
        "dispatch.dispatched_by": mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  const pickupsCount = await Orders.aggregate([
    {
      $match: { "pickup.pickedup_by": mongoose.Types.ObjectId(req.user.id) },
    },
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  return res.json({
    status: "success",
    logisticsMember,
    ordersCount,
    pickupsCount,
  });
};

/**
 * Returns the data required for logistics dashboard
 * @method GET
 * @api /logistics/dashboard
 * @access logistics-lead
 */
exports.dashboardController = async (req, res) => {
  const logisticsMember = await Users.find(
    { role: /logistics/i },
    { fullname: 1, email: 1, created_on: 1, phone: 1 }
  );

  const ordersCount = await Orders.aggregate([
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  const pickupCount = await Pickups.aggregate([
    { $match: { is_active: true } },
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  return res.json({
    status: "success",
    logisticsMember,
    ordersCount,
    pickupCount,
  });
};

/**
 * Returns the data required for warehouse dashboard
 * @method GET
 * @api /logistics/dashboard/member
 * @access logistics-member
 */
//  exports.dashboardController = async (req, res) => {
//   const logisticsMember = await Users.find(
//     { role: /logistics/i },
//     { fullname: 1, email: 1, created_on: 1, phone: 1 }
//   );

//   const ordersCount = await Orders.aggregate([
//     {
//       $group: { _id: "$status", count: { $sum: 1 } },
//     },
//   ]);

//   return res.json({ status: "success", logisticsMember, ordersCount });
// };

/**
 * Return all pickup requests
 * @method GET
 * @api /logistics/orders
 * @access logistics-lead
 */
exports.allOrderRequests = async (req, res) => {
  const orders = await Orders.find(
    { status: "dispatch_initiated" },
    { _id: 1, user: 1, address: 1, dispatch: 1 }
  )
    .populate([{ path: "user", select: "fullname" }, { path: "address" }])
    .sort({ _id: -1 });
    console.log(orders)
  return res.json({
    status: "success",
    pickups: orders,
 
  });
};

/**
 * Return all order requests of current user
 * @method GET
 * @api /logistics/orders/mine
 * @access logistics
 */
exports.myOrderRequests = async (req, res) => {
  const orders = await Orders.find(
    { status: "dispatch_assigned", "dispatch.dispatched_by": req.user.id },
    { _id: 1, user: 1, dispatch: 1 }
  )
    .populate([{ path: "user", select: "fullname" }, { path: "address" }])
    .sort({ _id: -1 });

  return res.json({
    status: "success",
    pickups: orders,
  });
};

/**
 * Assign a logistics-member to take the order from warehouse
 * @param order_id Order id
 * @param member_id Logistics member id
 * @method PUT
 * @api /logistics/orders/assign
 * @access logistics-lead
 */
exports.assignOrderDispatch = async (req, res) => {
  const { error, value } = dispatchAssignValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const order = await Orders.findOne(
    { _id: value.order_id, status: "dispatch_initiated" },
    { _id: 1, dispatch: 1, status: 1 }
  );
  if (!order) throw new BadRequestError("Invalid Order ID");

  // order.dispatch = { ...order.dispatch, dispatched_by: value.member_id };
  order.dispatch.dispatched_by = value.member_id;
  order.status = "dispatch_assigned";

  await order.save();

  return res.json({
    status: "success",
    message: "Dispatch assigned",
    order,
  });
};

/**
 * All in progress deliveirs
 * @method GET
 * @api /logistics/orders/in-progress
 * @access logistics-lead
 */
exports.inprogressDeliveries = async (req, res) => {
  const orders = await Orders.find(
    { status: "dispatch_collected" },
    { _id: 1, dispatch: 1 }
  )
    .populate("dispatch.dispatched_by", "fullname", "user")
    .sort({ _id: -1 });

  return res.json({
    status: "success",
    orders,
  });
};

/**
 * Mark order as collected from warehouse
 * @param order_id Order id
 * @method PUT
 * @api /logistics/orders/collected
 * @access logistics
 */
exports.orderCollected = async (req, res) => {
  const order = await Orders.findOne(
    { _id: req.body?.order_id, status: "dispatch_assigned" },
    { status: 1 }
  );
  if (!order) throw new BadRequestError("Invalid Order ID");

  order.status = "dispatch_collected";
  await order.save();

  return res.json({
    status: "success",
    message: "Order collected",
  });
};

/**
 * Mark order as delivered
 * @param order_id Order id
 * @method PUT
 * @api /logistics/orders/delivered
 * @access logistics
 */
exports.orderDelivered = async (req, res) => {
  const order = await Orders.findOne(
    { _id: req.body?.order_id, status: "dispatch_collected" },
    { dispatch: 1, status: 1, cart: 1 }
  ).populate([
    {
      path: "cart",
      populate: [
        {
          path: "kits",
          model: "kitInstance",
          select: "status",
        },
      ],
    },
  ]);
  if (!order) throw new BadRequestError("Invalid Order ID");

  // mark each kit as delivered
  for (const kit in order.cart.kits) {
    const kitInstance = await kitInstanceModel.findOne(
      { _id: order.cart.kits[kit]._id },
      { status: 1 }
    );
    if (!kitInstance) continue;
    kitInstance.status = "dispatch_completed";
    await kitInstance.save();
  }

  order.status = "dispatch_completed";
  order.dispatch.dispatched_on = Date.now();

  await order.save();

  return res.json({
    status: "success",
    message: "Order delivered",
    // order,
  });
};

/**
 * Get all delivered orders
 * @method GET
 * @api /logistics/orders/delivered
 * @access logistics
 */
exports.allOrderDelivered = async (req, res) => {
  const orders = await Orders.find(
    { status: "dispatch_completed" },
    { dispatch: 1, status: 1 }
  )
    .populate("dispatch.dispatched_by", "fullname", "user")
    .sort({ _id: -1 });

  return res.json({
    status: "success",
    orders,
    message: "Delivered orders...",
  });
};

/**
 * Return all pickup requests
 * @method GET
 * @api /logistics/pickups
 * @access logistics-lead
 */
exports.allPickupRequests = async (req, res) => {
  const pickups = await Pickups.find(
    { status: "pickup_scheduled", is_active: true },
    { _id: 1, user: 1, address: 1, kits: 1, date: 1, time: 1 }
  )
    .populate([{ path: "user", select: "fullname" }, { path: "address" }])
    .sort({ _id: -1 });

  return res.json({
    status: "success",
    pickups: pickups,
  });
};

/**
 * Return all pickup requests of current user
 * @method GET
 * @api /logistics/pickups/mine
 * @access logistics
 */
exports.myPickupRequests = async (req, res) => {
  const pickups = await Pickups.find(
    { status: "pickup_assigned", pickedup_by: req.user.id },
    { _id: 1, date: 1, time: 1, kits: 1 }
  ).sort({ _id: -1 });

  return res.json({
    status: "success",
    pickups: pickups,
  });
};

/**
 * Assign a logistics-member to take the pickup from client
 * @param order_id Order id
 * @param member_id Logistics member id
 * @method PUT
 * @api /logistics/pickups/assign
 * @access logistics-lead
 */
exports.assignPickupDispatch = async (req, res) => {
  const { error, value } = dispatchAssignValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const pickup = await Pickups.findOne(
    { _id: value.order_id, status: "pickup_scheduled" },
    { kits: 1, pickedup_by: 1, status: 1 }
  );
  if (!pickup) throw new BadRequestError("Invalid Order ID");

  pickup.pickedup_by = value.member_id;
  pickup.status = "pickup_assigned";
  await pickup.save();

  return res.json({
    status: "success",
    message: "Pickup assigned",
    pickup,
  });
};

/**
 * All in progress pickups
 * @method GET
 * @api /logistics/pickups/in-progress
 * @access logistics-lead
 */
exports.inprogressPickups = async (req, res) => {
  const pickup = await Pickups.find(
    { status: "pickup_collected" },
    { _id: 1, kits: 1, pickedup_by: 1, collected_on: 1 }
  )
    .populate("pickedup_by", "fullname", "user")
    .sort({ _id: -1 });

  return res.json({
    status: "success",
    pickup,
  });
};

/**
 * Mark pickup as delivered
 * @param order_id Order id
 * @method PUT
 * @api /logistics/pickups/delivered
 * @access logistics
 */
exports.pickupDelivered = async (req, res) => {
  const pickup = await Pickups.findOne(
    { _id: req.body?.order_id, status: "pickup_collected" },
    { status: 1, kits: 1, delivered_on: 1 }
  );
  if (!pickup) throw new BadRequestError("Invalid Order ID");

  // mark each kit as delivered
  for (const kit in pickup.kits) {
    const kitInstance = await kitInstanceModel.findOne(
      { _id: pickup.kits[kit], status: "registered" },
      { status: 1, timestamps: 1 }
    );
    if (!kitInstance) continue;
    kitInstance.status = "pickup_completed";
    kitInstance.timestamps.pickup_completed_on = Date.now();
    await kitInstance.save();
  }

  pickup.status = "pickup_completed";
  pickup.delivered_on = Date.now();
  await pickup.save();

  return res.json({
    status: "success",
    message: "Pickup delivered",
  });
};

/**
 * Get all delivered pickups
 * @method GET
 * @api /logistics/pickups/delivered
 * @access logistics
 */
exports.allPickupDelivered = async (req, res) => {
  const pickups = await Pickups.find(
    { status: "pickup_completed" },
    { pickedup_by: 1, status: 1, delivered_on: 1 }
  )
    .populate("pickedup_by", "fullname", "user")
    .sort({ _id: -1 });

  return res.json({
    status: "success",
    pickups,
    message: "Delivered pickups...",
  });
};

/**
 * Mark pickup as collected from client
 * @param order_id Order id
 * @method PUT
 * @api /logistics/pickups/collected
 * @access logistics
 */
exports.pickupCollected = async (req, res) => {
  const pickup = await Pickups.findOne(
    { _id: req.body?.order_id, status: "pickup_assigned" },
    { status: 1, collected_on: 1 }
  );
  if (!pickup) throw new BadRequestError("Invalid Order ID");

  pickup.status = "pickup_collected";
  pickup.collected_on = Date.now();
  await pickup.save();

  return res.json({
    status: "success",
    message: "Pickup collected",
  });
};
