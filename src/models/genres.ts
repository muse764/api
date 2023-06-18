import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getGenresModel = async (genre_id: string) =>
  await prisma.genre.findUnique({
    where: {
      id: genre_id,
    },
    select: {
      id: true,
      name: true,
    },
  });

export async function getSeveralGenresModel(ids: string[]): Promise<{}[]>;
export async function getSeveralGenresModel(
  limit: number,
  offset: number
): Promise<{}[]>;
export async function getSeveralGenresModel(
  idsOrLimit: string[] | number,
  offset?: number
): Promise<{}[]> {
  if (typeof idsOrLimit === 'number') {
    return await prisma.genre.findMany({
      take: idsOrLimit,
      skip: offset,
      select: {
        id: true,
        name: true,
      },
    });
  }
  return await prisma.genre.findMany({
    where: {
      id: {
        in: idsOrLimit,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export const createGenresModel = async (
  genres: {
    id: string;
    name: string;
  }[]
) =>
  await prisma.genre.createMany({
    data: genres,
  });

export const updateGenresModel = async (genre_id: string, name: string) =>
  await prisma.genre.update({
    where: {
      id: genre_id,
    },
    data: {
      name,
    },
  });

export const deleteGenresModel = async (genre_id: string) =>
  await prisma.genre.delete({
    where: {
      id: genre_id,
    },
  });

export const deleteSeveralGenresModel = async (ids: string[]) =>
  await prisma.genre.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
