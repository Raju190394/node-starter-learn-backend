import express from 'express';
import {
    login,
    register,
    logout,
    verify,
    refreshToken
} from './auth.controller.js';
import {authMiddleware} from '../../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify/:id', verify);
router.post('/logout', authMiddleware, logout);
router.post("/refresh-token", refreshToken);
export default router;