import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import {
  createGenresModel,
  deleteGenresModel,
  deleteSeveralGenresModel,
  getGenresModel,
  getSeveralGenresModel,
  updateGenresModel,
} from '../models';

export const createGenresController = async (req: Request, res: Response) => {
  try {
    const { genres } = req.body;

    if (!genres) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Missing genres',
        },
      });
    }

    genres.map((genre: any) => {
      const genre_id = randomUUID();
      genre.id = genre_id;
    });

    const createdGenres = await createGenresModel(genres);

    return res.status(200).json({
      createdGenres,
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
export const getGenresController = async (req: Request, res: Response) => {
  try {
    const { genre_id } = req.params;
    const genre = await getGenresModel(genre_id);

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
export const getSeveralGenresController = async (
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
      const genres = await getSeveralGenresModel(Number(limit), Number(offset));
      return res.status(200).json({
        limit: Number(limit),
        offset: Number(offset),
        total: genres.length,
        genres,
      });
    }

    if (ids) {
      const idsArray = (ids as string).split(',');

      const genres = await getSeveralGenresModel(idsArray);
      return res.status(200).json({ genres });
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

export const updateGenresController = async (req: Request, res: Response) => {
  try {
    const { genre_id } = req.params;
    const { name } = req.body;

    const genre = await getGenresModel(genre_id);

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

    const updatedGenre = await updateGenresModel(genre_id, name);

    return res.status(200).json(updatedGenre);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const deleteGenresController = async (req: Request, res: Response) => {
  try {
    const { genre_id } = req.params;

    const genre = await getGenresModel(genre_id);

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

    await deleteGenresModel(genre_id);

    return res.status(200).json({
      message: `Genre with id ${genre_id} has been deleted`,
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

export const deleteSeveralGenresController = async (
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

    const genres = await getSeveralGenresModel(idsArray);

    if (genres.length !== idsArray.length) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `Some ids were not found`,
        },
      });
    }

    await deleteSeveralGenresModel(idsArray);

    return res.status(200).json({
      message: `Genres with ids ${ids} has been deleted`,
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
