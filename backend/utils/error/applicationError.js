const CommonError = require('./commonError');

class ApplicationError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode ?? 500;
    this.status = CommonError[this.statusCode].STATUS;
    this.message = message ?? CommonError[this.statusCode].MESSAGE;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApplicationError;
