import AppError from "../utils/appError.js";

/**
 * Global Error Handling Middleware
 * Catch all operational or programming errors and send a standardized JSON response.
 */
const errorHandler = (err, req, res, next) => {
    console.error("Global Error Handler caught:", err); // ADDED FOR DEBUGGING
    
    // Set default status code and status if not set
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Send standardized JSON response to the client
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message || "Internal Server Error",
        // Optional: Include stack trace if in development mode
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

/**
 * 404 Route Not Found Middleware
 * Catch all requests that don't match any defined route.
 */
const notFoundHandler = (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

export { errorHandler, notFoundHandler };
