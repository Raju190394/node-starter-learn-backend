import { Router } from "express";
import userRoutes from "../modules/users/user.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import otpRoutes from "../modules/otp/otp.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/users", authMiddleware, userRoutes);

export default router;