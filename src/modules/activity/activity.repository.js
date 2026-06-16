import prisma from "../../common/config/prisma.js";

export const create  = async (data) => {
  return await prisma.userActivity.create({
    data
  });
};