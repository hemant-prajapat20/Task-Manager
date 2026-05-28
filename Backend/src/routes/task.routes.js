import express from "express";
import { verifyToken, restrictToAdmin } from "../middleware/auth.middleware.js";
import { 
    createTask, 
    deleteTask, 
    getDashboardData, 
    getTaskById, 
    getTasks, 
    updateTask, 
    updateTaskChecklist, 
    updateTaskStatus, 
    userDashboardData 
} from "../controllers/task.controller.js";

// Create a new router instance
const router = express.Router();

/**
 * -----------------------------------------------------
 * TASK MANAGEMENT ROUTES
 * Base Path: /api/tasks
 * -----------------------------------------------------
 */

// ==========================================
// Dashboard Statistics & Data
// ==========================================

// Route: Get admin dashboard statistics
router.get("/dashboard-data", verifyToken, restrictToAdmin, getDashboardData);

// Route: Get user-specific dashboard statistics
router.get("/user-dashboard-data", verifyToken, userDashboardData);


// ==========================================
// Basic Task Operations
// ==========================================

// Route: Get all tasks
// Description: Admins see all tasks, users see only their assigned tasks
router.get("/", verifyToken, getTasks);

// Route: Create a new task (Admin only)
router.post("/create", verifyToken, restrictToAdmin, createTask);

// Route: Get a task by ID
router.get("/:id", verifyToken, getTaskById);

// Route: Update task details
router.put("/:id", verifyToken, updateTask);

// Route: Delete a task (Admin only)
router.delete("/:id", verifyToken, restrictToAdmin, deleteTask);


// ==========================================
// Task Status & Progress Updates
// ==========================================

// Route: Update task status (e.g., Pending, In Progress, Completed)
router.put("/:id/status", verifyToken, updateTaskStatus);

// Route: Update todo checklist inside a task
router.put("/:id/todo", verifyToken, updateTaskChecklist);


// Export the router to use it in index.js
export default router;
