const router = require("express").Router();

const controller = require("./controller");
const { isAiTeam } = require("../global/hasAccess");

router.get("/ai/dashboard", isAiTeam, controller.dashboardController);
router.get("/ai/samples", isAiTeam, controller.activeSamples);
router.get("/ai/sample/details", isAiTeam, controller.activeSampleDetails);
router.put(
  "/ai/sample/data-processing",
  isAiTeam,
  controller.setDataProcessing
);
router.put(
  "/ai/sample/report-uploaded",
  isAiTeam,
  controller.setReportUploaded
);

module.exports = router;
