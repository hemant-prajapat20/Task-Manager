import dotenv from "dotenv";
// Load environment variables immediately at the top
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Config and Routes
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

// Initialize Express app
const app = express();

// ES Module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables immediately at the top
const envConfig = dotenv.config();
if (envConfig.error) {
    console.error("Error loading .env file:", envConfig.error);
}

// Ensure uploads directory exists (one level up from src/)
const uploadsDir = path.resolve(__dirname, "..", "uploads");
console.log(`[DEBUG] __dirname: ${__dirname}`);
console.log(`[DEBUG] uploadsDir: ${uploadsDir} (Type: ${typeof uploadsDir})`);

if (!fs.existsSync(uploadsDir)) {
    console.log("Creating uploads directory...");
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB
connectDB();

/**
 * Global Middleware
 */

// Handle Cross-Origin Resource Sharing
app.use(cors({
    origin: process.env.FRONT_END_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser()); // For secure auth cookies

// Serve static files (uploads) - Use absolute path for robustness
if (!uploadsDir) {
    console.error("FATAL: uploadsDir is undefined!");
} else {
    app.use("/uploads", express.static(uploadsDir));
}

/**
 * API Routes
 */
// Basic root route so visiting http://localhost:3000/ doesn't throw an error
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the Task Management System API",
    });
});

// Ignore favicon requests from browser
app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.get("/api", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});


/**
 * Error Handling
 */

// Catch-all route for undefined paths
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(errorHandler);

/**
 * Server Start
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Localhost Link: http://localhost:${PORT}`);
    console.log(`Static uploads served from: ${uploadsDir}`);
});
