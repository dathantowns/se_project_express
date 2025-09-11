const BadRequestError = require("./BadRequestError");

class NotFoundError extends BadRequestError {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
