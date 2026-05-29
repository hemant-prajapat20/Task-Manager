import express from 'express';
import { signup, signout, signin, userProfile, updateUserProfile, uploadImage } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

// Create a new router instance
const router = express.Router();

/**
 * -----------------------------------------------------
 * AUTHENTICATION ROUTES
 * Base Path: /api/auth
 * -----------------------------------------------------
 */

// ==========================================
// Public Routes (No login required)
// ==========================================

// Route: Register a new user
router.post('/signup', signup);

// Route: Login an existing user
router.post('/signin', signin);

// Route: Logout the current user
router.post("/sign-out", signout);

// Route: Upload a user profile image (public so it works during signup)
// "upload.single('image')" middleware parses the uploaded image
router.post("/upload-image", upload.single("image"), uploadImage);

// ==========================================
// Protected Routes (Login required)
// ==========================================

// Route: Get the current logged-in user's profile
router.get("/user-profile", verifyToken, userProfile);

// Route: Update user profile details
router.put("/update-profile", verifyToken, updateUserProfile);

// Export the router to use it in index.js
export default router;
