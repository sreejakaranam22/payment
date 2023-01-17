const ForbiddenError = require("../../errors/forbidden");

exports.isClient = (req, res, next) => {
  if (req.user?.role !== "client") throw new ForbiddenError();
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") throw new ForbiddenError();
  next();
};

exports.isWarehouse = (req, res, next) => {
  if (req.user?.role !== "warehouse") throw new ForbiddenError();
  next();
};

// all logistics member
exports.isLogistics = (req, res, next) => {
  // if (req.user.role !== "warehouse") throw new ForbiddenError();
  if (["logistics-lead", "logistics-member"].includes(req.user?.role))
    return next();
  throw new ForbiddenError();
};

// if logistics lead
exports.isLogisticsLead = (req, res, next) => {
  if (req.user?.role !== "logistics-lead") throw new ForbiddenError();
  next();
};

exports.isLogisticsMember = (req, res, next) => {
  if (req.user?.role !== "logistics-member") throw new ForbiddenError();
  next();
};

// if logistics lead
exports.isClinicalPartner = (req, res, next) => {
  if (req.user?.role !== "clinical") throw new ForbiddenError();
  next();

};

// if ai-team
exports.isAiTeam = (req, res, next) => {
  if (req.user?.role !== "ai") throw new ForbiddenError();
  next();
};
