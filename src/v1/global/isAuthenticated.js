const UnauthorizedError = require("../../errors/unauthorized");
const ForbiddenError = require("../../errors/forbidden");
const envConfig = require("../../config/env.config");

exports.isAuthenticated = (req, res, next) => {
  // console.log(req.isAuthenticated());
  if (!req.isAuthenticated()) throw new UnauthorizedError();
  if (req.user.is_active == 0) throw new ForbiddenError();
  next();
};

exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    // return res.redirect(envConfig.CLIENT_URL + "user/check");
    req.logout();
  next();
};
