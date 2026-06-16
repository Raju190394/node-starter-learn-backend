// User repository using Prisma client
import prisma from '../../common/config/prisma.js';
import { activeRecord } from "../../common/constants/filters.js";
import { paginate, cursorPaginate } from "../../common/utils/pagination.js";


export const findByEmail = async (email) => {
  return prisma.user.findFirst({
    where: {
      email
    },
  });
};

export const findById = async (id) => {
  return prisma.user.findFirst({
    where: {
      id: Number(id)
    },
  });
};

export const getAllUsers = async (query) => {

  const where = {
    ...activeRecord,
    ...(query.status && { status: query.status }),
    ...(query.search && {
      OR: [
        {
          name: {
            contains: query.search
          }
        },
        {
          email: {
            contains: query.search
          }
        },
        {
          phone: {
            contains: query.search
          }
        }
      ]
    })
  };
  // return paginate({
  //   model: prisma.user,
  //   where: activeRecord,
  //   page: Number(query.page) || 1,
  //   limit: Number(query.limit) || 20,
  //   orderBy: {
  //     id: "desc"
  //   }
  // });

  // cursorPaginate

  return cursorPaginate({
    model: prisma.user,
    where,
    cursor: query.cursor,
    limit: query.limit || 20
  });

};

export const create = async (data) => {
  return prisma.user.create({
    data,
  });
};

export const update = async (id, data) => {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
  });
};

export const remove = async (id) => {
  return prisma.user.delete({
    where: { id: Number(id) }
  });
};

export const softDelete = async (id) => {
  return prisma.user.update({
    where: { id: Number(id) },
    data: {
      deletedAt: new Date(),
    },
  });
};
