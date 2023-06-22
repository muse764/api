import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export const createUserModel = async (
  id: string,
  full_name: string,
  username: string,
  email: string,
  password: string,
  role: UserRole
) =>
  await prisma.user.create({
    data: {
      id,
      full_name,
      username,
      email,
      password,
      role,
    },
  });

export const getUserModel = async (id: string) =>
  await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      role: true,
    },
  });

export const getUsersProfileModel = async (id: string) =>
  await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      images: {
        select: {
          id: true,
          file: true,
          width: true,
          height: true,
        },
      },
    },
  });

export async function getSeveralUsersModel(ids: string[]): Promise<{}[]>;
export async function getSeveralUsersModel(
  limit: number,
  offset: number
): Promise<{}[]>;
export async function getSeveralUsersModel(
  idsOrLimit?: string[] | number,
  offset?: number
): Promise<{}[]> {
  if (Array.isArray(idsOrLimit)) {
    return await prisma.user.findMany({
      where: {
        id: {
          in: idsOrLimit,
        },
      },
      select: {
        id: true,
        username: true,
        images: {
          select: {
            id: true,
            file: true,
            width: true,
            height: true,
          },
        },
      },
    });
  } else {
    return await prisma.user.findMany({
      skip: offset,
      take: idsOrLimit,
      select: {
        id: true,
        username: true,
        images: {
          select: {
            id: true,
            file: true,
            width: true,
            height: true,
          },
        },
      },
    });
  }
}

export const getUsersPlaylistsModel = async (
  id: string,
  limit: number,
  offset: number
) =>
  await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      playlists: {
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          images: true,
          owner: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

export const createUsersPlaylistModel = async (
  id: string,
  name: string,
  description: string,
  user_id: string
) =>
  await prisma.playlist.create({
    data: {
      id,
      name,
      description,
      ownerId: user_id,
    },
  });

export const uploadUsersImagesModel = async (
  user_id: string,
  images: {
    id: string;
    file: string;
    width: number;
    height: number;
  }[]
) =>
  await prisma.user.update({
    where: {
      id: user_id,
    },
    data: {
      images: {
        create: images,
      },
    },
  });

export const getUserByEmailModel = async (email: string) =>
  await prisma.user.findUnique({
    where: {
      email,
    },
  });

export const updateUsersProfileModel = async (
  user_id: string,
  full_name: string,
  username: string,
  email: string,
  password: string
) =>
  await prisma.user.update({
    where: {
      id: user_id,
    },
    data: {
      full_name,
      username,
      email,
      password,
    },
  });
