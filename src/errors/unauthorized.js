const CustomError = require("./custom-error");

class UnauthorizedError extends CustomError {
  constructor() {
    super("User not authorized");
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
