import * as userRepository from "../users/user.repository.js";
import * as otpService from '../otp/otp.service.js'
import prisma from '../../common/config/prisma.js';
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
    generateAccessToken,
    generateRefreshToken
} from "../../common/constants/jwt.js"
import { activeRecord } from "../../common/constants/filters.js";

export const login = async (payload) => {

    const email = payload.email.toLowerCase().trim();
    const existingUser = await userRepository.findByEmail(email);

    if (!existingUser) {
        throw new Error("Username or password is incorrect.");
    }

    if (existingUser.status !== "ACTIVE") {
        throw new Error("Your account is inactive.");
    }

    if (existingUser.deletedAt) {
        throw new Error("Username or password is incorrect.");
    }

    if (!existingUser.emailVerified) {
        throw new Error("Email not verified.");
    }

    // if (!existingUser.phoneVerified) {
    //     throw new Error("Phone not verified.");
    // }
    // ✅ PASSWORD HASHING (IMPORTANT)
    const isPasswordValid = await bcrypt.compare(
        payload.password,
        existingUser.password
    );

    if (!isPasswordValid) {
        throw new Error("Username or password is incorrect.");
    }
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);
    const refreshTokenHash = crypto.createHash("sha256")
        .update(refreshToken)
        .digest("hex");
    await prisma.userSession.create({
        data: {
            userId: existingUser.id.toString(),
            refreshTokenHash,

            deviceName: payload.deviceName || "Unknown Device",
            ipAddress: payload.ip,
            userAgent: payload.userAgent,

            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: existingUser.id.toString(),
            name: existingUser.name,
            email: existingUser.email
        }
    };

};

export const verify = async (id, otp) => {

    const user = await prisma.user.findFirst({
        where: {
            id: Number(id),
            ...activeRecord
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.emailVerified) {
        throw new Error("Email already verified");
    }
    // ✅ 1. FIRST verify OTP
    const isOtpValid = await otpService.verifyOtp({
        userId: user.id.toString(),
        otp
    });

    if (!isOtpValid) {
        throw new Error("Invalid OTP");
    }

    // ✅ 2. THEN update user
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            emailVerified: true
        }
    });

    return {
        success: true,
        message: "OTP verified successfully",
    };
};