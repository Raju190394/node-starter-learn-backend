import * as userActivity from "./activity.repository.js";

export const logActivity = async ({
    userId,
    action,
    description,
    ipAddress,
    userAgent
}) => {
    return await userActivity.create({
            userId,
            action,
            description,
            ipAddress,
            userAgent
        });
};