import express from "express"
import { adminOnly, verifyToken } from "../utils/verifyUser.js";
import { createTask } from "../controller/task_controller.js";

const router = express.Router();

router.post("/create", verifyToken,adminOnly,createTask)
    

export default router;  