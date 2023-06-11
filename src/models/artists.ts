import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getArtists = () =>
  prisma.user.findMany({
    where: {
      role: 'ARTIST',
    },
    select: {
      id: true,
      full_name: true,
      active: true,
      images: true,
    },
  });

export const getArtistById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, full_name: true, active: true, images: true },
  });
