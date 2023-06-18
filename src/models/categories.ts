import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategoriesModel = async (category_id: string) =>
  await prisma.category.findUnique({
    where: {
      id: category_id,
    },
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
    },
  });

export async function getSeveralCategoriesModel(ids: string[]): Promise<{}[]>;
export async function getSeveralCategoriesModel(
  limit: number,
  offset: number
): Promise<{}[]>;
export async function getSeveralCategoriesModel(
  idsOrLimit: string[] | number,
  offset?: number
): Promise<{}[]> {
  if (typeof idsOrLimit === 'number') {
    return await prisma.category.findMany({
      take: idsOrLimit,
      skip: offset,
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
      },
    });
  }
  return await prisma.category.findMany({
    where: {
      id: {
        in: idsOrLimit,
      },
    },
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
    },
  });
}

export const createCategoriesModel = async (
  categories: {
    id: string;
    name: string;
  }[]
) =>
  await prisma.category.createMany({
    data: categories,
  });

export const updateCategoriesModel = async (
  category_id: string,
  name: string
) =>
  await prisma.category.update({
    where: {
      id: category_id,
    },
    data: {
      name,
    },
  });

export const deleteCategoriesModel = async (category_id: string) =>
  await prisma.category.delete({
    where: {
      id: category_id,
    },
  });

export const deleteSeveralCategoriesModel = async (ids: string[]) =>
  await prisma.category.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
