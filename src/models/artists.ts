import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getArtists = () =>
  prisma.user.findMany({
    where: {
      role: 'ARTIST',
    },
    include: {
      albums: true,
      images: true,
      playlists: true,
      tracks: true,
    },
  });

export const getArtistById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    include: {
      albums: true,
      images: true,
      playlists: true,
      tracks: true,
    },
  });
