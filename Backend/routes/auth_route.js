import express from 'express';
import { signup ,signin,userProfile,updateUserProfile} from '../controller/auth_controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.post('/signup',signup)
router.post('/signin',signin)

router.get("/user-profile",verifyToken,userProfile)
router.put("/update-profile",verifyToken,updateUserProfile)

export default router;