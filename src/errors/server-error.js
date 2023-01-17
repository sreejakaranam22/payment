const CustomError = require("./custom-error");

class ServerError extends CustomError {
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "ServerError";
    this.statusCode = 500;
  }
}

module.exports = ServerError;
