import crypto from "crypto";
import * as otpRepo from "./otp.repository.js";
import prisma from "../../common/config/prisma.js";

// generate OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOtp = (otp) => {
    return crypto.createHash("sha256").update(otp).digest("hex");
};

// SEND OTP
export const sendOtp = async (userId, type = "EMAIL") => {
    const user = await prisma.user.findFirst({
        where: { id: Number(userId) },
    });

    if (!user) throw new Error("User not found");

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    await otpRepo.createOtp({
        userId: user.id.toString(),
        otpHash,
        type,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // TODO: email/sms integration
    console.log("OTP:", otp);

    return {
        success: true,
        message: "OTP sent successfully",
    };
};

export const resendOtp = async (userId, type = "EMAIL") => {
    const user = await prisma.user.findFirst({
        where: { id: Number(userId) },
    });

    if (!user) throw new Error("User not found");

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    const existingOtp = await otpRepo.findOtp({
        userId: BigInt(user.id),
        type,
    });

    if (existingOtp) {
        await otpRepo.updateOtp(existingOtp.id, {
            otpHash,
            attempts: 0,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });
    } else {
        await otpRepo.createOtp({
            userId: BigInt(user.id),
            otpHash,
            type,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });
    }

    // TODO: email/sms integration
    console.log("OTP:", otp);

    return {
        success: true,
        message: "OTP sent successfully",
    };
};

// VERIFY OTP
export const verifyOtp = async ({ userId, otp, type = "EMAIL" }) => {
    console.log("otp: ", otp);
    const otpHash = hashOtp(otp);

    const record = await otpRepo.findOtp({
        userId: Number(userId),
        type,
        otpHash,
    });

    if (!record) throw new Error("Invalid OTP");

    if (record.expiresAt < new Date()) {
        throw new Error("OTP expired");
    }

    await otpRepo.deleteOtp(record.id);

    return {
        success: true,
        message: "OTP verified successfully",
    };
};