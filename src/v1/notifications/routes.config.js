const router = require("express").Router();
const { isAuthenticated } = require("../global/isAuthenticated");
const controller = require("./controller");

router.get("/notifications", isAuthenticated, controller.allNotifications);

module.exports = router;
