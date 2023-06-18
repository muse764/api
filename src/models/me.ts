import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCurrentUsersProfileModel = async (user_id: string) =>
  await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      id: true,
      full_name: true,
      username: true,
      email: true,
      images: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export const getCurrentUsersPlaylistsModel = async (user_id: string) =>
  await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      playlists: true,
    },
  });

export const getCurrentUsersAlbumsModel = async (user_id: string) =>
  await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      albums: true,
    },
  });

export const getCurrentUsersTracksModel = async (user_id: string) =>
  await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      tracks: true,
    },
  });
