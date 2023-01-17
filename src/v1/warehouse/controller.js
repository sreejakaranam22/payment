const Users = require("../users/models");
const { Orders } = require("../orders/models");
const BadRequestError = require("../../errors/bad-request");

/**
 * Returns the data required for warehouse dashboard
 * @method GET
 * @api /warehouse/dashboard
 * @access warehouse
 */
exports.dashboardController = async (req, res) => {
  const warehouseMembers = await Users.find(
    { role: "warehouse" },
    { fullname: 1, email: 1, created_on: 1, phone: 1 }
  );

  const ordersCount = await Orders.aggregate([
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  return res.json({ status: "success", warehouseMembers, ordersCount });
};

/**
 * Returns the active orders
 * @method GET
 * @api /warehouse/orders/active
 * @access warehouse
 */
exports.activeOrders = async (req, res) => {
  const activeOrders = await Orders.find(
    {
      status: {
        $in: [
          "paid",
          // "order_confirmed",
          "dispatch_initiated",
          "dispatch_paused",
        ],
      },
    },
    { _id: 1, user: 1, ordered_on: 1, status: 1 }
  )
    .populate("user", { fullname: 1 })
    .sort({ _id: -1 });

  return res.json({ status: "success", activeOrders });
};

/**
 * Initiate pickup
 * @method PUT
 * @api /warehouse/orders/active/initiate
 * @access warehouse
 */
exports.initiatePickup = async (req, res) => {
  const order = await Orders.findOne(
    { _id: req.body?.order_id },
    { status: 1, dispatch: 1 }
  );
  if (!order) throw new BadRequestError("Invalid Order ID");

  order.status = "dispatch_initiated";
  order.dispatch = { ...order.dispatch, initiated_on: Date.now() };
  await order.save();

  return res.json({
    status: "success",
    order,
    message: "Initiated",
  });
};

/**
 * Pause pickup
 * @method PUT
 * @api /warehouse/orders/active/pause
 * @access warehouse
 */
exports.pausePickup = async (req, res) => {
  const order = await Orders.findOne(
    { _id: req.body?.order_id },
    { status: 1 }
  );
  if (!order) throw new BadRequestError("Invalid Order ID");

  order.status = "dispatch_paused";
  await order.save();

  return res.json({
    status: "success",
    order,
    message: "Paused",
  });
};

/**
 * Returns the dispatched orders
 * @method GET
 * @api /warehouse/orders/dispatched
 * @access warehouse
 */
exports.dispatchedOrders = async (req, res) => {
  const dispatchedOrders = await Orders.find(
    {
      status: "dispatch_completed",
    },
    { _id: 1, user: 1, dispatch: 1 }
  )
    .populate([
      {
        path: "user",
        model: "user",
        select: "fullname",
      },
      {
        path: "dispatch.dispatched_by",
        model: "user",
        select: "fullname",
      },
    ])
    .sort({ _id: 1 });

  return res.json({ status: "success", dispatchedOrders });
};
