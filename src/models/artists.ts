import { AlbumType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getArtistsModel = async (artist_id: string) =>
  await prisma.user.findFirst({
    where: {
      id: artist_id,
      role: 'ARTIST',
    },
    select: {
      id: true,
      full_name: true,
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

export async function getSeveralArtistsModel(ids: string[]): Promise<{}[]>;
export async function getSeveralArtistsModel(
  limit: number,
  offset: number
): Promise<{}[]>;
export async function getSeveralArtistsModel(
  idsOrLimit?: string[] | number,
  offset?: number
): Promise<{}[]> {
  if (Array.isArray(idsOrLimit)) {
    return await prisma.user.findMany({
      where: {
        id: {
          in: idsOrLimit,
        },
        role: 'ARTIST',
      },
      select: {
        id: true,
        full_name: true,
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
      where: {
        role: 'ARTIST',
      },
      skip: offset,
      take: idsOrLimit,
      select: {
        id: true,
        full_name: true,
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

export const getArtistsAlbumsModel = async (
  artist_id: string,
  limit: number,
  offset: number
) =>
  await prisma.user.findFirst({
    where: {
      id: artist_id,
      role: 'ARTIST',
    },
    select: {
      albums: {
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          type: true,
          release_date: true,
          genres: {
            select: {
              name: true,
            },
          },
          artists: {
            select: {
              id: true,
              full_name: true,
              images: {
                select: {
                  id: true,
                  file: true,
                  width: true,
                  height: true,
                },
              },
            },
          },
          tracks: {
            select: {
              id: true,
              name: true,
              file: true,
              track_number: true,
              artists: {
                select: {
                  id: true,
                  full_name: true,
                },
              },
              duration: true,
            },
          },
          images: {
            select: {
              id: true,
              file: true,
              width: true,
              height: true,
            },
          },
        },
      },
    },
  });

export const getArtistsTracksModel = async (
  artist_id: string,
  limit: number,
  offset: number
) =>
  await prisma.user.findFirst({
    where: {
      id: artist_id,
      role: 'ARTIST',
    },
    select: {
      tracks: {
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          album: {
            select: {
              id: true,
              name: true,
              images: {
                select: {
                  id: true,
                  file: true,
                  width: true,
                  height: true,
                },
              },
              release_date: true,
              type: true,
              genres: {
                select: {
                  name: true,
                },
              },
              artists: {
                select: {
                  id: true,
                  full_name: true,
                },
              },
            },
          },
          artists: {
            select: {
              id: true,
              full_name: true,
              images: {
                select: {
                  id: true,
                  file: true,
                  width: true,
                  height: true,
                },
              },
            },
          },
          track_number: true,
          duration: true,
        },
      },
    },
  });

export const createArtistsAlbumsModel = async (
  artist_id: string,
  albums: {
    id: string;
    name: string;
    release_date: string;
    type: AlbumType;
  }[]
) =>
  await prisma.user.update({
    where: {
      id: artist_id,
    },
    data: {
      albums: {
        create: albums,
      },
    },
  });
