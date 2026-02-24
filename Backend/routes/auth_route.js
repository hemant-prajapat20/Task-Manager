import express from 'express';
import { Signup } from '../controller/auth_controller.js';

const router = express.Router();


router.post('/signup',Signup)

export default router;