import express from 'express';
import dotenv from 'dotenv';
import { signup, login, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/login",login);
router.post("/logout",logout);
router.post("/signup",signup);

export default router;
