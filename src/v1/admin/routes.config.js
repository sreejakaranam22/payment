const router = require("express").Router();
const { isAdmin } = require("../global/hasAccess");
const controller = require("./controller");

router.get("/admin/dashboard", isAdmin, controller.dashboardController);
router.get("/admin/sample/details", isAdmin, controller.activeSampleDetails);
router.get("/admin/kit-delivery-status", isAdmin, controller.kitDeliveryStatus);
router.get(
  "/admin/sample-delivery-status",
  isAdmin,
  controller.sampleDeliveryStatus
);
router.get(
  "/admin/data-sequencing-status",
  isAdmin,
  controller.dataSequencingStatus
);
router.get(
  "/admin/data-processing-status",
  isAdmin,
  controller.dataProcessingStatus
);
router.get("/admin/completed-orders", isAdmin, controller.completedOrders);
router.get("/admin/customers", isAdmin, controller.allCustomers);
router.get("/admin/team-members", isAdmin, controller.teamMembers);
router.get("/admin/payments", isAdmin, controller.paymentDetails);
router.get("/admin/active-packages", isAdmin, controller.activePackages);
router.get("/admin/orders/details", isAdmin, controller.orderDetails);
router.get("/admin/pickups/details", isAdmin, controller.pickupDetails);
router.post("/admin/members/add", isAdmin, controller.addMember);
router.put("/admin/members/update", isAdmin, controller.updateMember);
router.delete("/admin/members/delete", isAdmin, controller.deleteMember);

module.exports = router;
