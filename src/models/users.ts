import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsersModel = async () => await prisma.user.findMany({});

export const getUserByIdModel = async (id: string) =>
  await prisma.user.findUnique({
    where: {
      id,
    },
  });

export const getUserByEmailModel = async (email: string) =>
  await prisma.user.findUnique({
    where: {
      email,
    },
  });

export const getUserByUsernameModel = async (username: string) =>
  await prisma.user.findUnique({
    where: {
      username,
    },
  });

export const createUserModel = async (
  id: string,
  full_name: string,
  username: string,
  email: string,
  password: string
) =>
  await prisma.user.create({
    data: {
      id,
      full_name,
      username,
      email,
      password,
    },
  });

export const updateUserByIdModel = async (
  id: string,
  full_name: string,
  username: string,
  email: string,
  password: string
) =>
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      full_name,
      username,
      email,
      password,
    },
  });

export const deleteUserByIdModel = async (id: string) =>
  await prisma.user.delete({
    where: {
      id,
    },
  });

export const deleteAllUsersModel = async () => await prisma.user.deleteMany();

export const deleteUsersModel = async () => await prisma.user.deleteMany();
