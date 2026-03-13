import express from 'express';
import { signup,signout,signin,userProfile,updateUserProfile,uploadImage} from '../controller/auth_controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../utils/multer.js';

const router = express.Router();


router.post('/signup',signup)
router.post('/signin',signin)

router.get("/user-profile",verifyToken,userProfile)
router.put("/update-profile",verifyToken,updateUserProfile)

router.post("/upload-image",upload.single("image"),uploadImage)

router.post("/sign-out", signout)

export default router;