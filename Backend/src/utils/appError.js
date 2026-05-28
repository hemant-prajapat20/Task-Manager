/**
 * Custom Error class to handle operational errors in the application.
 * Extends the built-in Error class to include a status code and success flag.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Flag to identify expected/operational errors

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
