import { AlbumType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAlbumModel = async (
  id: string,
  name: string,
  release_date: string,
  type: AlbumType,
  artists: string[],
  tracks: {
    id: string;
    name: string;
    file: string;
    duration: number;
    track_number: number;
  }[]
) => {
  return await prisma.album.create({
    data: {
      id,
      name,
      release_date,
      type,
      artists: {
        connect: artists.map((artistId) => {
          return {
            id: artistId,
          };
        }),
      },
      tracks: {
        createMany: {
          data: tracks,
        },
      },
    },
  });
};

export const getAllAlbumsModel = async (limit: number, offset: number) => {
  return await prisma.album.findMany({
    skip: offset,
    take: limit,
    include: {
      artists: true,
      images: true,
      tracks: true,
      genres: true,
    },
  });
};

export const getAlbumByIdModel = async (id: string) => {
  return await prisma.album.findUnique({
    where: {
      id,
    },
    include: {
      artists: true,
      images: true,
      tracks: true,
      genres: true,
    },
  });
};

export const updateAlbumByIdModel = async (
  id: string,
  name: string,
  release_date: string,
  type: AlbumType,
  published: boolean
) => {
  return await prisma.album.update({
    where: {
      id,
    },
    data: {
      name,
      release_date,
      type,
      published,
    },
  });
};

export const deleteAlbumByIdModel = async (id: string) => {
  return await prisma.album.delete({
    where: {
      id,
    },
  });
};

// TODO: REMOVE IN PRODUCTION
export const deleteAllAlbumsModel = async () => {
  return await prisma.album.deleteMany();
};
