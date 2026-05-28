import express from "express";
import { verifyToken, restrictToAdmin } from "../middleware/auth.middleware.js";
import { getUserById, getUsers, deleteUser } from "../controllers/user.controller.js";

// Create a new router instance
const router = express.Router();

/**
 * -----------------------------------------------------
 * USER MANAGEMENT ROUTES
 * Base Path: /api/users
 * -----------------------------------------------------
 */

// Route: Get all users
// Description: Only an admin can see the full list of users
router.get("/get-users", verifyToken, restrictToAdmin, getUsers);

// Route: Get a specific user by their ID
// Description: Any logged-in user can view user details
router.get("/:id", verifyToken, getUserById);

// Route: Delete a specific user by their ID
// Description: Only admins can delete a user
router.delete("/:id", verifyToken, restrictToAdmin, deleteUser);

// Export the router to use it in index.js
export default router;
