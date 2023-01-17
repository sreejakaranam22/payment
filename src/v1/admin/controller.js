const Users = require("../users/models");
const { Orders } = require("../orders/models");
const { Kits } = require("../cart/models");
const Pickups = require("../pickups/model");
const Products = require("../products/models");
const BadRequestError = require("../../errors/bad-request");
const paymentModel = require("../orders/models/payment.model");
const { memberValidator, updateMemberValidator } = require("./validator");

/**
 * Returns the data required for warehouse dashboard
 * @method GET
 * @api /admin/dashboard
 * @access admin
 */
exports.dashboardController = async (req, res) => {
  const memberCount = await Users.aggregate([
    { $match: { is_active: 1 } },
    {
      $group: { _id: "$role", count: { $sum: 1 } },
    },
  ]);

  const ordersCount = await Orders.aggregate([
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  const pickupCount = await Pickups.aggregate([
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  return res.json({ status: "success", memberCount, ordersCount, pickupCount });
};

/**
 * Get details of samples
 * @method GET
 * @api /admin/sample/details?kitId=
 * @access admin
 */
exports.activeSampleDetails = async (req, res) => {
  const kit = await Kits.findOne(
    { _id: req.query.kitId },
    { _id: 1, timestamps: 1, patient_id: 1, pickup_id: 1, status: 1 }
  ).populate([
    {
      path: "patient_id",
      select: ["firstname", "lastname", "age", "gender", "blood_type"],
      model: "member",
    },
    {
      path: "pickup_id",
      select: "user",
      model: "pickups",
      populate: {
        path: "user",
        select: ["fullname", "email", "phone"],
        model: "user",
      },
    },
  ]);

  if (!kit) throw new BadRequestError("Invalid kit id");

  return res.json({
    status: "success",
    kit,
  });
};

/**
 * Returns the kit delivery status
 * @method GET
 * @api /admin/kit-delivery-status
 * @access admin
 */
exports.kitDeliveryStatus = async (req, res) => {
  const orders = await Orders.find(
    {
      status: {
        $in: [
          "paid",
          // "order_confirmed",
          /dispatch_/i,
        ],
      },
    },
    { user: 1, status: 1, ordered_on: 1 }
  ).populate("user", "fullname");

  return res.json({ status: "success", orders });
};

/**
 * Returns the sample delivery status
 * @method GET
 * @api /admin/sample-delivery-status
 * @access admin
 */
exports.sampleDeliveryStatus = async (req, res) => {
  const pickups = await Pickups.find(
    {
      status: {
        $in: [/pickup_/i],
      },
    },
    { user: 1, status: 1, date: 1, time: 1 }
  ).populate("user", "fullname");

  return res.json({ status: "success", pickups });
};

/**
 * Returns the data sequencing status
 * @method GET
 * @api /admin/data-sequencing-status
 * @access admin
 */
exports.dataSequencingStatus = async (req, res) => {
  const kits = await Kits.find(
    {
      status: {
        $in: ["pickup_completed", /sample_/i],
      },
    },
    { patient_id: 1, status: 1, timestamps: 1 }
  ).populate("patient_id", ["firstname", "lastname"], "member");

  return res.json({ status: "success", kits });
};

/**
 * Returns the data processing status
 * @method GET
 * @api /admin/data-processing-status
 * @access admin
 */
exports.dataProcessingStatus = async (req, res) => {
  const kits = await Kits.find(
    {
      status: {
        $in: [/data_/i],
      },
    },
    { patient_id: 1, status: 1, timestamps: 1 }
  ).populate("patient_id", ["firstname", "lastname"], "member");

  return res.json({ status: "success", kits });
};

/**
 * Returns the data processing status
 * @method GET
 * @api /admin/completed-orders
 * @access admin
 */
exports.completedOrders = async (req, res) => {
  const kits = await Kits.find(
    {
      status: "reports_uploaded",
    },
    { patient_id: 1, status: 1, timestamps: 1 }
  )
    .populate("patient_id", ["firstname", "lastname"], "member")
    .sort({ _id: -1 });

  return res.json({ status: "success", kits });
};

/**
 * Returns all customers
 * @method GET
 * @api /admin/customers
 * @access admin
 */
exports.allCustomers = async (req, res) => {
  const users = await Users.find(
    {
      role: "client",
    },
    {
      fullname: 1,
      email: 1,
      phone: 1,
    }
  ).sort({ _id: -1 });

  return res.json({ status: "success", users });
};

/**
 * Returns the team members
 * @method GET
 * @api /admin/team-members
 * @access admin
 */
exports.teamMembers = async (req, res) => {
  const users = await Users.find(
    {
      role: {
        $in: [
          "warehouse",
          "logistics-lead",
          "logistics-member",
          "clinical",
          "ai",
        ],
      },
    },
    {
      fullname: 1,
      email: 1,
      phone: 1,
      role: 1,
    }
  );

  return res.json({ status: "success", users });
};

/**
 * Returns the payment details
 * @method GET
 * @api /admin/payments
 * @access admin
 */
exports.paymentDetails = async (req, res) => {
  const payment = await paymentModel
    .find(
      {
        // status: {
        //   $in: ["success", "failed"],
        // },
      },
      { "razorpay.amount": 1, status: 1 }
    )
    .populate([
      {
        path: "order",
        select: ["ordered_on", "user"],
        populate: { path: "user", select: "fullname" },
      },
    ])
    .sort({ _id: -1 });

  return res.json({ status: "success", payment });
};

/**
 * Get order details
 * @method GET
 * @api /admin/orders/details?order_id=
 * @access admin
 */
exports.orderDetails = async (req, res) => {
  const order = await Orders.findOne(
    { _id: req.query.order_id },
    { address: 1, status: 1, cart: 1, dispatch: 1, ordered_on: 1 } // pickup: 1,
  )
    .populate([
      {
        path: "cart",
        populate: [
          {
            path: "kits",
            model: "kitInstance",
            select: ["product", "_id"],
            populate: {
              path: "product",
              model: "healthkit",
              select: "name",
            },
          },
          {
            path: "user",
            model: "user",
            select: ["fullname", "email", "phone"],
          },
        ],
      },
      {
        path: "address",
        model: "address",
        select: [
          "address",
          "address_two",
          "landmark",
          "city",
          "state",
          "zip",
          "phone",
          "address_type",
        ],
      },
      {
        path: "dispatch.dispatched_by",
        model: "user",
        select: "fullname",
      },
      // {
      //   path: "pickup.pickedup_by",
      //   model: "user",
      //   select: "fullname",
      // },
    ])
    .sort({ _id: -1 });

  if (!order) throw new BadRequestError("Invalid Order Id.");
  // const cart = await Carts.findById(order.cart, { price: 1 });

  return res.json({
    status: "success",
    order,
  });
};

/**
 * Fetch pickups details
 * @method GET
 * @api /admin/pickups/details?pickupId=
 * @access client
 */
exports.pickupDetails = async (req, res) => {
  const existingPickupRequest = await Pickups.findOne(
    {
      // user: req.user.id,
      // status: {
      //   $in: ["created", "registered"],
      // },
      _id: req.query.pickupId,
    },
    {
      kits: 1,
      status: 1,
      address: 1,
      date: 1,
      time: 1,
      pickedup_by: 1,
      collected_on: 1,
      delivered_on: 1,
      user: 1,
    }
  )
    .populate([
      {
        path: "kits",
        model: "kitInstance",
        select: ["patient_id", "_id", "product"],
        populate: [
          {
            path: "patient_id",
            model: "member",
            select: ["firstname", "lastname", "age", "gender", "blood_type"],
          },
          {
            path: "product",
            model: "healthkit",
            select: "name",
          },
        ],
      },
      {
        path: "address",
        model: "address",
        select: ["address", "landmark", "city", "state", "zip", "phone"],
      },
      {
        path: "pickedup_by",
        model: "user",
        select: "fullname",
      },
      {
        path: "user",
        model: "user",
        select: ["fullname", "email", "phone"],
      },
    ])
    .sort({ _id: -1 });

  if (!existingPickupRequest)
    throw new BadRequestError("No active request found!");

  return res.json({
    status: "success",
    pickup: existingPickupRequest,
  });
};

/**
 * Returns the active packages
 * @method GET
 * @api /admin/active-packages
 * @access admin
 */
exports.activePackages = async (req, res) => {
  const packages = await Products.find({ is_active: true });

  return res.json({ status: "success", packages });
};

/**
 * Adding members from admin dashboard
 * @method POST
 * @api /admin/members/add
 * @access admin
 */
exports.addMember = async (req, res) => {
  const { error, value } = memberValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const existsUser = await Users.findOne({ email: value.email });
  if (existsUser) throw new BadRequestError("Email already in use.");

  const user = await Users.create(value);
  user.is_active = 1;
  user.is_verified = 1;
  await user.save();

  return res.status(201).json({
    status: "success",
    message: "User added",
    user: user._id,
  });
};

/**
 * Updating members from admin dashboard
 * @method PUT
 * @api /admin/members/update
 * @access admin
 */
exports.updateMember = async (req, res) => {
  const existsUser = await Users.findOne({ _id: req.body.userId });
  if (!existsUser) throw new BadRequestError("Invalid user id");

  const { error, value } = updateMemberValidator(req.body.member);
  if (error) throw new BadRequestError(error.message);

  await Users.findByIdAndUpdate(req.body.userId, value);

  return res.json({
    status: "success",
    message: "User updatedd",
  });
};

/**
 * Delete member from admin dashboard
 * @method DELETE
 * @api /admin/members/delete
 * @access admin
 */
exports.deleteMember = async (req, res) => {
  const existsUser = await Users.findOne({ _id: req.body.userId });
  if (!existsUser) throw new BadRequestError("Invalid user id");

  existsUser.is_active = 0;
  await existsUser.save();

  return res.json({
    status: "success",
    message: "User deleted",
  });
};
