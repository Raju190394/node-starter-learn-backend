import * as otpService from "./otp.service.js";

// SEND OTP
export const sendOtpController = async (req, res) => {
  try {
    const result = await otpService.sendOtp(
      req.user.id,
      req.body.type
    );

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resendOtpController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await otpService.resendOtp(
      id,
      req.body.type || "EMAIL"
    );

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// VERIFY OTP
export const verifyOtpController = async (req, res) => {
  try {
    const result = await otpService.verifyOtp({
      userId: req.user.id,
      otp: req.body.otp,
      type: req.body.type,
    });

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};