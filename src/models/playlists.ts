import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPlaylistModel = async (playlist_id: string) => {
  return await prisma.playlist.findUnique({
    where: {
      id: playlist_id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
      tracks: true,
      owner: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export async function getSeveralPlaylistsModel(ids: string[]): Promise<{}[]>;
export async function getSeveralPlaylistsModel(
  limit: number,
  offset: number
): Promise<{}[]>;
export async function getSeveralPlaylistsModel(
  idsOrLimit?: string[] | number,
  offset?: number
): Promise<{}[]> {
  if (Array.isArray(idsOrLimit)) {
    return await prisma.playlist.findMany({
      where: {
        id: {
          in: idsOrLimit,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        tracks: true,
      },
    });
  } else {
    return await prisma.playlist.findMany({
      skip: offset,
      take: idsOrLimit,
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        tracks: true,
      },
    });
  }
}

export const getPlaylistsTracksModel = async (
  playlist_id: string,
  limit: number,
  offset: number
) =>
  await prisma.playlist.findUnique({
    where: {
      id: playlist_id,
    },
    select: {
      tracks: {
        skip: offset,
        take: limit,
      },
    },
  });

export const updatePlaylistDetailsModel = async (
  playlist_id: string,
  name: string,
  description: string
) =>
  await prisma.playlist.update({
    where: {
      id: playlist_id,
    },
    data: {
      name,
      description,
    },
  });

export const uploadPlaylistsImagesModel = async (
  playlist_id: string,
  images: {
    id: string;
    file: string;
    width: number;
    height: number;
  }[]
) =>
  await prisma.playlist.update({
    where: {
      id: playlist_id,
    },
    data: {
      images: {
        create: images,
      },
    },
  });

export const addPlaylistsTracksModel = async (
  playlist_id: string,
  tracks: string[]
) =>
  await prisma.playlist.update({
    where: {
      id: playlist_id,
    },
    data: {
      tracks: {
        connect: tracks.map((track_id) => ({
          id: track_id,
        })),
      },
    },
  });

export const removePlaylistsTracksModel = async (
  playlist_id: string,
  tracks: string[]
) =>
  await prisma.playlist.update({
    where: {
      id: playlist_id,
    },
    data: {
      tracks: {
        disconnect: tracks.map((track_id) => ({
          id: track_id,
        })),
      },
    },
  });

export const removePlaylistsImagesModel = async (
  playlist_id: string,
  images: string[]
) =>
  await prisma.playlist.update({
    where: {
      id: playlist_id,
    },
    data: {
      images: {
        delete: images.map((image_id) => ({
          id: image_id,
        })),
      },
    },
  });
