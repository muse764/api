import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createGenreModel = async (
  id: string,
  name: string,
  active: boolean
) => {
  return await prisma.genre.create({
    data: {
      id,
      name,
      active,
    },
  });
};

export const getAllGenresModel = async () => {
  return await prisma.genre.findMany();
};

export const getGenreByIdModel = async (id: string) => {
  return await prisma.genre.findUnique({
    where: {
      id,
    },
  });
};

export const updateGenreByIdModel = async (
  id: string,
  name: string,
  active: boolean
) => {
  return await prisma.genre.update({
    where: {
      id,
    },
    data: {
      name,
      active,
    },
  });
};

export const deleteGenreByIdModel = async (id: string) => {
  return await prisma.genre.delete({
    where: {
      id,
    },
  });
};

export const deleteAllGenresModel = async () => {
  return await prisma.genre.deleteMany();
};
