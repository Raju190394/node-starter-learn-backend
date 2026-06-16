import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: BigInt(user.id),
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user.id.toString(),
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "30d"
        }
    );
};