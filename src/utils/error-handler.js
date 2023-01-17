const CustomError = require("../errors/custom-error");
const ActionRequiredError = require("../errors/action-required");

exports.errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ActionRequiredError) {
    return res.status(err.statusCode).json({
      status: "failed",
      message: err.message || "Something is pending!",
      action: err.action,
    });
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: "failed",
      message: err.message || "Something went wrong!",
    });
  }

  return res.status(400).json({
    status: "failed",
    message:
      process.env.NODE_ENV == "production"
        ? "Something went wrong!"
        : err.message,
  });
};
