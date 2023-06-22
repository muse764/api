import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTracksModel = async (track_id: string) =>
  await prisma.track.findUnique({
    where: {
      id: track_id,
    },
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
  });

export async function getSeveralTracksModel(ids: string[]): Promise<{}[]>;
export async function getSeveralTracksModel(
  limit: number,
  offset: number
): Promise<{}[]>;
export async function getSeveralTracksModel(
  idsOrLimit?: string[] | number,
  offset?: number
): Promise<{}[]> {
  if (Array.isArray(idsOrLimit)) {
    return await prisma.track.findMany({
      where: {
        id: {
          in: idsOrLimit,
        },
      },
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
    });
  } else {
    return await prisma.track.findMany({
      skip: offset,
      take: idsOrLimit,
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
    });
  }
}

export const updateTrackDetailsModel = async (
  track_id: string,
  name: string,
  albumId: string,
  file: string,
  duration: number,
  track_number: number
) =>
  await prisma.track.update({
    where: {
      id: track_id,
    },
    data: {
      name,
      albumId,
      file,
      duration,
      track_number,
    },
  });

export const addTracksArtistsModel = async (
  track_id: string,
  artists: string[]
) =>
  await prisma.track.update({
    where: {
      id: track_id,
    },
    data: {
      artists: {
        connect: artists.map((artist) => ({
          id: artist,
        })),
      },
    },
  });

export const removeTracksArtistsModel = async (
  track_id: string,
  artists: string[]
) =>
  await prisma.track.update({
    where: {
      id: track_id,
    },
    data: {
      artists: {
        disconnect: artists.map((artist) => ({
          id: artist,
        })),
      },
    },
  });
