import * as authService from './auth.service.js';
import * as userService from '../users/user.service.js';
import * as otpService from '../otp/otp.service.js';

export const login = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    };
    const data = await authService.login(payload);

    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const user = await userService.create(req.body);
    const otp_message = await otpService.sendOtp(user.id);
    res.status(201).json({
      success: true,
      otp_message,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



export const logout = async (req, res) => {
  try {
    // console.log(req.body);

    await prisma.userSession.updateMany({
      where: { userId: req.user.id },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const verify = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const result = await authService.verify(id, data.otp);

    await prisma.userSession.updateMany({
      where: { userId: id },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.json({
      success: true,
      message: "Your account has been verified successfully."
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const refreshToken = async (req, res) => {
  try {
    const result = await authService.refreshAccessToken(
      req.body.refreshToken
    );

    return res.json(result);
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



