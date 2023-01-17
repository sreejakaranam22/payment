const CustomError = require("./custom-error");

class NotFoundError extends CustomError {
  constructor() {
    super("Route not found");
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
