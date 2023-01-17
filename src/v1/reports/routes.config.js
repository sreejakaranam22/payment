const { isAuthenticated } = require("../global/isAuthenticated");
const { availableReports, sendReport } = require("./controller");

const router = require("express").Router();

router.get("/reports/available", isAuthenticated, availableReports);
router.get("/reports/:kit", isAuthenticated, sendReport);

module.exports = router;
