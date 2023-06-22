import { AlbumType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAlbumsModel = async (album_id: string) =>
  await prisma.album.findUnique({
    where: {
      id: album_id,
    },
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
  });

export async function getSeveralAlbumsModel(ids: string[]): Promise<{}[]>;
export async function getSeveralAlbumsModel(
  limit: number,
  offset: number
): Promise<{}[]>;
export async function getSeveralAlbumsModel(
  idsOrLimit?: string[] | number,
  offset?: number
): Promise<{}[]> {
  if (Array.isArray(idsOrLimit)) {
    return await prisma.album.findMany({
      where: {
        id: {
          in: idsOrLimit,
        },
      },
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
    });
  } else {
    return await prisma.album.findMany({
      skip: offset,
      take: idsOrLimit,
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
    });
  }
}

export const getAlbumsTracksModel = async (
  album_id: string,
  limit: number,
  offset: number
) =>
  await prisma.album.findUnique({
    where: {
      id: album_id,
    },
    select: {
      tracks: {
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          file: true,
          album: {
            select: {
              id: true,
              name: true,
            },
          },
          artists: {
            select: {
              id: true,
              full_name: true,
            },
          },
          track_number: true,
          duration: true,
        },
      },
    },
  });

export const updateAlbumDetailsModel = async (
  album_id: string,
  name: string,
  release_date: string,
  type: AlbumType
) =>
  await prisma.album.update({
    where: {
      id: album_id,
    },
    data: {
      name,
      release_date,
      type,
    },
  });

export const createAlbumsTracksModel = async (
  album_id: string,
  tracks: {
    id: string;
    name: string;
    duration: number;
    albumId: string;
    file: string;
    track_number: number;
    artists: {
      connect: {
        id: string;
      };
    };
  }[]
) =>
  await prisma.album.update({
    where: {
      id: album_id,
    },
    data: {
      tracks: {
        create: tracks,
      },
    },
  });

export const uploadAlbumsImagesModel = async (
  album_id: string,
  images: {
    id: string;
    file: string;
    width: number;
    height: number;
  }[]
) =>
  await prisma.album.update({
    where: {
      id: album_id,
    },
    data: {
      images: {
        create: images,
      },
    },
  });

export const removeAlbumsTracksModel = async (
  album_id: string,
  tracks: string[]
) =>
  await prisma.album.update({
    where: {
      id: album_id,
    },
    data: {
      tracks: {
        delete: tracks.map((track_id) => ({
          id: track_id,
        })),
      },
    },
  });

export const removeAlbumsImagesModel = async (
  album_id: string,
  images: string[]
) =>
  await prisma.album.update({
    where: {
      id: album_id,
    },
    data: {
      images: {
        delete: images.map((image_id) => ({
          id: image_id,
        })),
      },
    },
  });

export const addAlbumsGenresModel = async (
  album_id: string,
  genres: string[]
) =>
  await prisma.album.update({
    where: {
      id: album_id,
    },
    data: {
      genres: {
        connect: genres.map((genre_id) => ({
          id: genre_id,
        })),
      },
    },
  });

export const removeAlbumsGenresModel = async (
  album_id: string,
  genres: string[]
) =>
  await prisma.album.update({
    where: {
      id: album_id,
    },
    data: {
      genres: {
        disconnect: genres.map((genre_id) => ({
          id: genre_id,
        })),
      },
    },
  });

export const addAlbumsArtistsModel = async (
  album_id: string,
  artists: string[]
) =>
  await prisma.album.update({
    where: {
      id: album_id,
    },
    data: {
      artists: {
        connect: artists.map((artist_id) => ({
          id: artist_id,
        })),
      },
    },
  });

export const removeAlbumsArtistsModel = async (
  album_id: string,
  artists: string[]
) =>
  await prisma.album.update({
    where: {
      id: album_id,
    },
    data: {
      artists: {
        disconnect: artists.map((artist_id) => ({
          id: artist_id,
        })),
      },
    },
  });
