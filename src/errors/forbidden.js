const CustomError = require("./custom-error");

class ForbiddenError extends CustomError {
  constructor(message = "No Permission") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
