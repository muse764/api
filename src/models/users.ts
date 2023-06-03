import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async () =>
  await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      password: false,
      type: true,
    },
  });

export const getUsersWithPassword = async () => await prisma.user.findMany();

export const getUserById = async (id: string) =>
  await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: false,
      images: true,
    },
  });

export const getUserByIdWithPassword = async (id: string) =>
  await prisma.user.findUnique({
    where: {
      id,
    },
  });

export const getUserByEmail = async (email: string) =>
  await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      type: true,
    },
  });

export const getUserByEmailWithPassword = async (email: string) =>
  await prisma.user.findUnique({
    where: {
      email,
    },
  });

export const getUserByUsername = async (username: string) =>
  await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: false,
      type: true,
    },
  });

export const getUserByUsernameWithPassword = async (username: string) =>
  await prisma.user.findUnique({
    where: {
      username,
    },
  });

export const createUser = async (
  id: string,
  username: string,
  email: string,
  password: string,
  type: string,
) =>
  await prisma.user.create({
    data: {
      id,
      username,
      email,
      password,
      type,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: false,
      type: true,
    },
  });

export const updateUserById = async (
  id: string,
  username: string,
  email: string,
  password: string,
  type: string,
) =>
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      username,
      email,
      password,
      type,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: false,
      type: true,
    },
  });

export const deleteUserById = async (id: string) =>
  await prisma.user.delete({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: false,
      type: true,
    },
  });

export const deleteUsers = async () => await prisma.user.deleteMany();
