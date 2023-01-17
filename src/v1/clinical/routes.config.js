const router = require("express").Router();

const { isClinicalPartner } = require("../global/hasAccess");
const controller = require("./controller");

router.get( 
  "/clinical/dashboard",
  isClinicalPartner,
  controller.dashboardController
);
router.get("/clinical/samples", isClinicalPartner, controller.activeSamples);
router.get(
  "/clinical/sample/details",
  isClinicalPartner,
  controller.activeSampleDetails
);
router.put(
  "/clinical/sample/approve",
  isClinicalPartner,
  controller.sampleApproved
);
router.put(
  "/clinical/sample/reject",
  isClinicalPartner,
  controller.sampleRejected
);
router.put(
  "/clinical/sample/data-uploaded",
  isClinicalPartner,
  controller.dataUploaded
);

module.exports = router;
