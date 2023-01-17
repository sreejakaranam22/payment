const { isClient } = require("../global/hasAccess");
const { isAuthenticated } = require("../global/isAuthenticated");
const orderController = require("./controllers/order.controller");

const router = require("express").Router();

router.post(
  "/orders/create",
  [isAuthenticated, isClient],
  orderController.createOrder
);
router.post(
  "/orders/payment",
  [isAuthenticated, isClient],
  orderController.makePayment
);
router.post(
  "/orders/payment/verify",
  [isAuthenticated, isClient],
  orderController.verifyPayment
);
router.get(
  "/orders/current/status",
  isAuthenticated,
  orderController.getCurrentOrderStatus
);
router.get("/orders", isAuthenticated, orderController.getAllOrders);
// router.get("/orders/pickups", isAuthenticated, orderController.getAllPickups);
router.get("/orders/details", isAuthenticated, orderController.orderDetails);
// router.put("/orders/schedule", isAuthenticated, orderController.schedulePickup);
router.get(
  "/orders/kits-tobe-schedule-pickup",
  isAuthenticated,
  orderController.kitsTobeSchedulePickup
);

module.exports = router;
