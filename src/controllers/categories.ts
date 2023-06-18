import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import {
  createCategoriesModel,
  deleteCategoriesModel,
  deleteSeveralCategoriesModel,
  getCategoriesModel,
  getSeveralCategoriesModel,
  updateCategoriesModel,
} from '../models';

export const createCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { categories } = req.body;

    if (!categories) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Missing categories',
        },
      });
    }

    categories.map((genre: any) => {
      const genre_id = randomUUID();
      genre.id = genre_id;
    });

    const createdCategories = await createCategoriesModel(categories);

    return res.status(200).json({
      createdCategories,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};
export const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const { genre_id } = req.params;
    const genre = await getCategoriesModel(genre_id);

    if (!genre) {
      const status = 404;
      const message = `Genre not found`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    return res.status(200).json(genre);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};
export const getSeveralCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { ids, limit, offset } = req.query;

    if (
      (limit && offset && ids) ||
      (limit && !offset && ids) ||
      (!limit && offset && ids)
    ) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You can't use limit, offset and ids at the same time`,
        },
      });
    }

    if (!limit && !offset && !ids) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You must use limit, offset or ids`,
        },
      });
    }

    if ((limit && !offset) || (!limit && offset)) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You must use limit and offset at the same time`,
        },
      });
    }

    if (limit && offset) {
      const categories = await getSeveralCategoriesModel(
        Number(limit),
        Number(offset)
      );
      return res.status(200).json({ categories });
    }

    if (ids) {
      const idsArray = (ids as string).split(',');

      const categories = await getSeveralCategoriesModel(idsArray);
      return res.status(200).json({ categories });
    }
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const updateCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { category_id } = req.params;
    const { name } = req.body;

    const category = await getCategoriesModel(category_id);

    if (!category) {
      const status = 404;
      const message = `Category_id not found`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    const updatedCategory = await updateCategoriesModel(category_id, name);

    return res.status(200).json(updatedCategory);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const deleteCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { category_id } = req.params;

    const category = await getCategoriesModel(category_id);

    if (!category) {
      const status = 404;
      const message = `Category_id not found`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    await deleteCategoriesModel(category_id);

    return res.status(200).json({
      message: `Category with id ${category_id} has been deleted`,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const deleteSeveralCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You must use ids`,
        },
      });
    }

    const idsArray = (ids as string).split(',');

    const categories = await getSeveralCategoriesModel(idsArray);

    if (categories.length !== idsArray.length) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `Some ids were not found`,
        },
      });
    }

    await deleteSeveralCategoriesModel(idsArray);

    return res.status(200).json({
      message: `Categories with ids ${ids} has been deleted`,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};
