import { ArtistRole, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTrackModel = async (
  id: string,
  name: string,
  file: string,
  duration: number,
  track_number: number,
  albumId: string,
  artists: { artistId: string; role: ArtistRole }[]
) => {
  return await prisma.track.create({
    data: {
      id,
      name,
      file,
      duration,
      track_number,
      albumId,
      artists: {
        create: artists,
      },
    },
  });
};

export const getAllTracksModel = async (limit: number, offset: number) => {
  return await prisma.track.findMany({
    skip: offset,
    take: limit,
    include: {
      artists: true,
    },
  });
};

export const getTrackByIdModel = async (id: string) => {
  return await prisma.track.findUnique({
    where: {
      id,
    },
    include: {
      artists: true,
    },
  });
};

export const updateTrackModel = async (
  id: string,
  name: string,
  file: string,
  duration: number
) => {
  return await prisma.track.update({
    where: {
      id,
    },
    data: {
      name,
      file,
      duration,
    },
  });
};

export const deleteTrackModel = async (id: string) => {
  return await prisma.track.delete({
    where: {
      id,
    },
  });
};

export const deleteAllTracksModel = async () => {
  return await prisma.track.deleteMany();
};
