const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Orders, Payments } = require("../models");
const { Carts } = require("../../cart/models");
const BadRequestError = require("../../../errors/bad-request");
const { orderValidator, razorpayResponseValidator } = require("../validators");
const envConfig = require("../../../config/env.config");
// const { orderPlaced } = require("../../../utils/email");
const Notifications = require("../../notifications/functions");

const razorpay = new Razorpay({
  key_id: envConfig.razorpay.KEY_ID,
  key_secret: envConfig.razorpay.KEY_SECRET,
});

/**
 * Add an order
 * @method POST
 * @api /orders/create
 * @access client
 */
exports.createOrder = async (req, res) => {

  // Input validation
  const { error, value } = orderValidator(req.body);
  if (error) throw new BadRequestError(error.message);
  // checkif any unpaid order exists created 
  const unpaidOrder = await Orders.findOne(
    { user: req.user.id, status: "created" },
    { status: 1 }
  );
 


  if (unpaidOrder)

    return res.status(201).json({
      status: "success",
      messgae: "Order created! unpaid",
     
    });

  // check if active cart exists
  const activeCart = await Carts.findOne(
    {
      user: req.user.id,
      is_ordered: false,
    },
    {
      kits: 1,
      price: 1,
    }
  );
  if (!activeCart)
    throw new BadRequestError("You don't have any item on cart!");

  
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
    // current year
    let year = date_ob.getFullYear();
    
    // console.log(date,month,year,"date")
    
  const num = await Orders.find().sort({_id:-1}).limit(1)
  
  let count =("00" + (+num[0].order_id.slice( 3, 6 )+1)).slice(-3)
 
  console.log(year,"date")

  const orderInstance = {
    user: req.user.id,
    cart: activeCart._id,
    // address: {
    //   firstname: value.firstname,
    //   lastname: value.lastname,
    //   landmark: value.landmark || "",
    //   address: value.address,
    //   city: value.city,
    //   state: value.state,
    //   zip: value.zip,
    //   phone: value.phone,
    // },
    address: value.address_id,
    order_id : "IOM".concat(count).concat('C').concat(date).concat(month).concat(year),
   
  };

  const order = await Orders.create(orderInstance);
  console.log(order)

  return res.status(201).json({
    status: "success",
    message: "Order created! ",
  
    });
};

/**
 * Verify successfull payments
 * @method POST
 * @api /orders/payment
 * @access client
 */
exports.makePayment = async (req, res) => {

 
  //TODO: RECHECK THIS API FOR BUGS
  const unpaidOrder = await Orders.findOne(
    { user: req.user.id, status: "created" },
    { status: 1 }
  );
  if (!unpaidOrder)
    throw new BadRequestError("You don't have any unpaid order");

  // price of the cart
  const activeCart = await Carts.findOne(
    {
      user: req.user.id,
      is_ordered: false,
    },
    {
      price: 1,
    }
  );
  // console.log(activeCart);
  // creating razorpay payment object
  const options = {
    amount: activeCart.price.toFixed(2) * 100, // amount in the smallest currency unit
    // amount : 1 * 100,
    currency: "INR",
  };

  const razorpayOrder = await razorpay.orders.create(options);

  // saving payment details on database
  const payment = await Payments.create({
    order: unpaidOrder._id,
    razorpay: razorpayOrder,
  });
  return res.json({
    status: "success",
    payment,
  });
};


/**
 * Verify successfull payments
 * @method POST
 * @api /orders/payment/verify
 * @access client
 */
exports.verifyPayment = async (req, res) => {
  // verify inputs
  const { error, value } = razorpayResponseValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  let body = value.razorpay_order_id + "|" + value.razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", envConfig.razorpay.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  // if (process.env.NODE_ENV === "development") {
  //   console.log("sig received ", value.razorpay_signature);
  //   console.log("sig generated ", expectedSignature);
  // }

  if (expectedSignature !== value.razorpay_signature)
    throw new BadRequestError("Signature missmatched!");

  const payment = await Payments.findOne({
    "razorpay.id": value.razorpay_order_id,
  });
  const order = await Orders.findOne(
    { _id: payment.order },
    { status: 1, cart: 1 }
  );
  const cart = await Carts.findOne({ _id: order.cart }, { is_ordered: 1 });
  // TODO: which one to take - authorized or captured

  payment.status = "success";
  order.status = "paid";
  order.ordered_on = Date.now();
  cart.is_ordered = true;

  await payment.save();
  await order.save();
  await cart.save();

  await Notifications.orderPlaced(req.user.id, order._id);

  return res.json({
    status: "success",
    message: "Payment successful",
  });
};

/**
 * Get current order status
 * @method GET
 * @api /orders/current/status
 * @access client
 */
exports.getCurrentOrderStatus = async (req, res) => {
  //TODO: add validation
  const statusFilter = req.query.filter;

  const currentOrder = await Orders.findOne(
    { user: req.user.id, status: statusFilter || "created" },
    { address: 1, status: 1 } // pickup: 1
  ).populate("address", { user_id: 0, is_active: 0 });
  if (!currentOrder)
    return res.json({
      status: "success",
      message: "No active order found!",
    });
  return res.json({
    status: "success",
    message: "Active order found!",
    order: currentOrder,
  });
};

// TODO: CANCEL CURRENT ORDER

/**
 * Get all orders
 * @method GET
 * @api /orders
 * @access client
 */
exports.getAllOrders = async (req, res) => {
  let orders = await Orders.find(
    { user: req.user.id },
    { _id: 1,order_id:1, status: 1, cart: 1 }
  )
    .sort({ _id: -1 })
    .populate({
      path: "cart",
      select: "kits",
      populate: [
        {
          path: "kits",
          model: "kitInstance",
          select: ["id", "status"],
        },
      ],
    });

  // filter just created and cancelled orders
  orders = orders.filter(
    (order) =>
      !(
        (order.status === "created" || order.status === "cancelled") // ||
        // new RegExp("pickup*").test(order.status)
      )
  );

  let scheduleRemaining = {};
  for (
    let index = 0;
    index < (orders.length > 3 ? 3 : orders.length);
    index++
  ) {
    const element = orders[index];
    element.cart.kits.map((kit) => {
      if (
        kit.status === "dispatch_completed" &&
        !(orders[index]._id in scheduleRemaining)
      ) {
        Object.assign(scheduleRemaining, { [orders[index]._id]: true });
      }
    });
  }

  return res.json({
    status: "success",
    orders,
    scheduleRemaining,
  });
};

/**
 * Get order details
 * @method GET
 * @api /orders/details
 * @access client
 */
exports.orderDetails = async (req, res) => {
  const order = await Orders.findOne(
    { _id: req.query.order_id },
    { address: 1,order_id:1, status: 1, cart: 1, dispatch: 1, ordered_on: 1 } // pickup: 1,
  ).populate([
    {
      path: "cart",
      populate: [
        {
          path: "kits",
          model: "kitInstance",
          select: ["product", "_id", "status"],
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
  ]);
  let scheduleRemaining = 0;
  order.cart.kits.map((kit) => {
    if (kit.status === "dispatch_completed") scheduleRemaining += 1;
  });
  if (!order) throw new BadRequestError("Invalid Order Id.");
  // const cart = await Carts.findById(order.cart, { price: 1 });

  return res.json({
    status: "success",
    order,
    scheduleRemaining,
  });
};

/**
 * Get kit list to be schedule pickup
 * @method GET
 * @api /orders/kits-tobe-schedule-pickup
 * @access client
 */
exports.kitsTobeSchedulePickup = async (req, res) => {
  const orders = await Orders.find(
    { user: req.user.id, status: "dispatch_completed" },
    { cart: 1 }
  ).populate([
    {
      path: "cart",
      select: "kits",
      populate: [
        {
          path: "kits",
          model: "kitInstance",
          select: ["status", "patient_id", "added_to_pickup"],
          populate: {
            path: "patient_id",
            model: "member",
            select: [
              "firstname",
              "lastname",
              "age",
              "gender",
              "blood_type",
              "existing_disease",
              "details",
            ],
          },
        },
      ],
    },
  ]);

  if (!orders) throw new BadRequestError("No active order found!");

  // search in each order if there is any not-scheduled kit
  let kits = [];
  orders.map((order) => {
    kits.push(
      order.cart?.kits.filter(
        (kit) =>
          kit.status === "dispatch_completed" && kit.added_to_pickup === false
      )
    );
  });

  return res.json({
    status: "success",
    kits,
  });
};
