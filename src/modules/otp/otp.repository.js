import prisma from "../../common/config/prisma.js";

export const createOtp = async (data) => {
    console.log("prisma.otp =", prisma.otp);
  return await prisma.otp.create({
    data,
  });
};

export const findOtp = async (filters) => {
  return await prisma.otp.findFirst({
    where: filters,
    orderBy: { createdAt: "desc" },
  });
};

export const deleteOtp = async (id) => {
  return await prisma.otp.delete({
    where: { id },
  });
};

export const updateOtp = async (id, data) => {
  return prisma.otp.update({
    where: { id },
    data,
  });
};