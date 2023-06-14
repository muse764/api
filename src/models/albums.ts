import { AlbumType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAlbumModel = async (
  id: string,
  name: string,
  release_date: string,
  type: AlbumType,
  published: boolean
  // artists: string[],
  // genres: string[],
  // tracks: string[]
) => {
  return await prisma.album.create({
    data: {
      id,
      name,
      release_date,
      type,
      published,
      // artists: {
      //   connect: artists.map((artist) => ({
      //     id: artist,
      //   })),
      // },
      // tracks: {
      //   connect: tracks.map((track) => ({
      //     id: track,
      //   })),
      // },
      // genres: {
      //   connect: genres.map((genre) => ({
      //     id: genre,
      //   })),
      // },
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
