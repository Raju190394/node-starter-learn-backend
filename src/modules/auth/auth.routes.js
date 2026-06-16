import express from 'express';
import {
    login,
    register,
    logout,
    verify
} from './auth.controller.js';
import {authMiddleware} from '../../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify/:id', verify);
router.post('/logout', authMiddleware, logout);

export default router;