import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createImageModel = async (
  id: string,
  file: string,
  width: number,
  height: number,
  userId: string
) =>
  await prisma.image.create({
    data: {
      id,
      file,
      width,
      height,
      userId
    },
  });

export const getAllImagesModel = async () => await prisma.image.findMany();

export const getImageByIdModel = async (id: string) =>
  await prisma.image.findUnique({
    where: {
      id,
    },
  });

export const deleteImageByIdModel = async (id: string) =>
  await prisma.image.delete({
    where: {
      id,
    },
  });

export const updateImageByIdModel = async (
  id: string,
  file: string,
  width: number,
  height: number
) =>
  await prisma.image.update({
    where: {
      id,
    },
    data: {
      file,
      width,
      height,
    },
  });
