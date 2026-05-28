import express from "express";
import { verifyToken, restrictToAdmin } from "../middleware/auth.middleware.js";
import { exportTaskReport, exportUsersReport } from "../controllers/report.controller.js";

const router = express.Router();

/**
 * Report Generation Routes (Admin Only)
 */

router.get("/tasks", verifyToken, restrictToAdmin, exportTaskReport);
router.get("/users", verifyToken, restrictToAdmin, exportUsersReport);

export default router;
