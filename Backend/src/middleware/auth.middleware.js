import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

/**
 * Middleware to verify the JWT token from cookies.
 * Attaches the decoded user to the request object.
 */
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(new AppError("Authentication required. Please log in.", 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new AppError("Invalid or expired token. Please log in again.", 401));
        }
        
        // decoded contains { Id, role } as signed in auth.controller.js
        req.user = decoded;
        next();
    });
};

/**
 * Middleware to restrict access to admin users only.
 * Should be used AFTER verifyToken.
 */
export const restrictToAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return next(new AppError("Access denied. Admin privileges required.", 403));
    }
    next();
};
