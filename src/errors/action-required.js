const CustomError = require("./custom-error");

// this error is thrown if some previous action is pending
class ActionRequiredError extends CustomError {
  constructor(message, action) {
    super(message);
    this.name = "ActionRequiredError";
    this.action = action;
    this.statusCode = 400;
  }
}

module.exports = ActionRequiredError;
