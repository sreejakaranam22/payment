const controller = require("./controller");
const router = require("express").Router();
const { isAuthenticated } = require("../global/isAuthenticated");
const { isClient } = require("../global/hasAccess");

router.get("/pickups", [isAuthenticated], controller.allPickups);
router.post(
  "/pickups/schedule/create",
  [isAuthenticated, isClient],
  controller.schedulePickup
);
router.post(
  "/pickups/schedule/set-datetime",
  [isAuthenticated, isClient],
  controller.schedulePickupDatetime
);
router.get(
  "/pickups/register-kit",
  [isAuthenticated],
  controller.registeredKitDetails
);
router.put(
  "/pickups/register-kit/preview",
  [isAuthenticated, isClient],
  controller.registerKitPreview
);
router.put(
  "/pickups/register-kit/save",
  [isAuthenticated, isClient],
  controller.registerKitSave
);

module.exports = router;
