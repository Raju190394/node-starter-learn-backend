import express from "express";
import {
  sendOtpController,
  verifyOtpController,
  resendOtpController
} from "./otp.controller.js";

import { optionalAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", optionalAuth, sendOtpController);
router.post("/verify", optionalAuth, verifyOtpController);
router.post("/resend/:id", resendOtpController);

export default router;