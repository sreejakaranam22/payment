const registerValidator = require("./register");
const loginValidator = require("./login");
const emailVerifyValidator = require("./verify-email");
const changePassword = require("./change-password");
const profileValidator = require("./profile");
const mobileLoginValidator = require("./mobile-login")
const resetPasswordValidator = require("./set-password")

exports.userLoginValidator = loginValidator;
exports.userRegistrationValidator = registerValidator;
exports.emailVerifyValidator = emailVerifyValidator;
exports.changePasswordValidator = changePassword;
exports.userProfileValidator = profileValidator;
exports.mobileLoginValidator = mobileLoginValidator;
exports.resetPasswordValidator = resetPasswordValidator;