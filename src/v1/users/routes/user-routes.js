const router = require("express").Router();

const { isAuthenticated } = require("../../global/isAuthenticated");
const userController = require("../controllers/users.controllers");

router.get("/dashboard", isAuthenticated, userController.dashboardController);
router.put("/verify/email", userController.verifyEmail);
router.post("/verify/email/otp", userController.getEmailOtp);
router.post("/password/change", userController.changePassword);
router.post("/profile", isAuthenticated, userController.setProfile);

module.exports = router;
