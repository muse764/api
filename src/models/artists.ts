import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getArtists = () =>
  prisma.artist.findMany({
    select: {
      id: true,
      name: true,
      images: true,
    },
  });

export const getArtistById = (id: string) =>
  prisma.artist.findUnique({ where: { id } });

export const createArtist = (id: string, name: string) => {
  return prisma.artist.create({
    data: {
      id,
      name,
    },
  });
};

export const updateArtistById = (id: string, data: any) => {
  return prisma.artist.update({
    where: { id },
    data,
  });
};

export const deleteArtistById = (id: string) => {
  return prisma.artist.delete({
    where: { id },
  });
};
