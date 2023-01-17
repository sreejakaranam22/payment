const { isWarehouse } = require("../global/hasAccess");
const {
  dashboardController,
  activeOrders,
  dispatchedOrders,
  pausePickup,
  initiatePickup,
} = require("./controller");

const router = require("express").Router();

router.get("/warehouse/dashboard", isWarehouse, dashboardController);
router.get("/warehouse/orders/active", isWarehouse, activeOrders);
router.get("/warehouse/orders/dispatched", isWarehouse, dispatchedOrders);
router.put("/warehouse/orders/active/initiate", isWarehouse, initiatePickup);
router.put("/warehouse/orders/active/pause", isWarehouse, pausePickup);

module.exports = router;
