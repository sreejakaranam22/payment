const {
  isLogisticsLead,
  isLogistics,
  isLogisticsMember,
} = require("../global/hasAccess");
const controller = require("./controller");

const router = require("express").Router();

router.get(
  "/logistics/dashboard/member",
  isLogisticsMember,
  controller.memberDashboardController
);
router.get("/logistics/members", isLogisticsLead, controller.allMembers);
router.get(
  "/logistics/dashboard",
  isLogisticsLead,
  controller.dashboardController
);
router.get("/logistics/orders", isLogisticsLead, controller.allOrderRequests);
router.get("/logistics/orders/mine", isLogistics, controller.myOrderRequests);
router.get(
  "/logistics/orders/in-progress",
  isLogistics,
  controller.inprogressDeliveries
);
router.put(
  "/logistics/orders/assign",
  isLogisticsLead,
  controller.assignOrderDispatch
);
router.put(
  "/logistics/orders/collected",
  isLogistics,
  controller.orderCollected
);
router.put(
  "/logistics/orders/delivered",
  isLogistics,
  controller.orderDelivered
);
router.get(
  "/logistics/orders/delivered",
  isLogistics,
  controller.allOrderDelivered
);
router.get("/logistics/pickups", isLogisticsLead, controller.allPickupRequests);
router.get("/logistics/pickups/mine", isLogistics, controller.myPickupRequests);
router.get(
  "/logistics/pickups/in-progress",
  isLogistics,
  controller.inprogressPickups
);
router.put(
  "/logistics/pickups/assign",
  isLogisticsLead,
  controller.assignPickupDispatch
);
router.put(
  "/logistics/pickups/collected",
  isLogistics,
  controller.pickupCollected
);
router.put(
  "/logistics/pickups/delivered",
  isLogistics,
  controller.pickupDelivered
);
router.get(
  "/logistics/pickups/delivered",
  isLogistics,
  controller.allPickupDelivered
);

module.exports = router;
