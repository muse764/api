import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAlbumsModel = async (genre_id: string) =>
  await prisma.album.findUnique({
    where: {
      id: genre_id,
    },
  });

export async function getSeveralAlbumsModel(ids: string[]): Promise<{}[]>;
export async function getSeveralAlbumsModel(
  limit: number,
  offset: number
): Promise<{}[]>;
export async function getSeveralAlbumsModel(
  idsOrLimit: string[] | number,
  offset?: number
): Promise<{}[]> {
  if (typeof idsOrLimit === 'number') {
    return await prisma.album.findMany({
      take: idsOrLimit,
      skip: offset,
    });
  }
  return await prisma.album.findMany({
    where: {
      id: {
        in: idsOrLimit,
      },
    },
  });
}
