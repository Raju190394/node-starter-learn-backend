import * as userRepository from "../users/user.repository.js";
import * as otpService from '../otp/otp.service.js'
import prisma from '../../common/config/prisma.js';
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
            userId: BigInt(existingUser.id),
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
            id: BigInt(existingUser.id),
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
        userId: BigInt(user.id),
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

export const refreshAccessToken = async (refreshToken) => {

    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }
    console.log("refreshToken", refreshToken);
    // 1. Verify JWT
    let decoded;

    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }

    // 2. Hash incoming refresh token
    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    // 3. Find active session
    const session = await prisma.userSession.findFirst({
        where: {
            userId: decoded.id.toString(),
            refreshTokenHash,
        },
    });

    if (!session) {
        throw new Error("Refresh token not found");
    }

    // 4. Check session expiry
    if (session.expiresAt < new Date()) {
        throw new Error("Refresh token expired");
    }

    // 5. Get user
    const user = await prisma.user.findUnique({
        where: {
            id: Number(decoded.id),
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // 6. Generate new access token
    const accessToken = generateAccessToken(user);

    return {
        success: true,
        accessToken,
    };
};