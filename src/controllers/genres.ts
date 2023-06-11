import crypto from 'crypto';

import { Request, Response } from 'express';

import {
  createGenreModel,
  deleteAllGenresModel,
  deleteGenreByIdModel,
  getAllGenresModel,
  getGenreByIdModel,
  updateGenreByIdModel,
} from '../models';

export const createGenreController = async (req: Request, res: Response) => {
  const { name, active } = req.body;

  if (!name) {
    const status = 400;
    const message = 'Name is required';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }

  const id = crypto.randomBytes(16).toString('hex');

  try {
    const genre = await createGenreModel(id, name, active);

    res.status(201).json(genre);
  } catch (error) {
    const status = 500;
    const message = 'Something went wrong';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};

export const getAllGenresController = async (req: Request, res: Response) => {
  const { ids, limit, offset } = req.query;
  try {
    var genres;
    if (ids) {
      const idsArray = (ids as string).split(',');
      genres = await Promise.all(
        idsArray.map(async (id) => {
          const album = await getGenreByIdModel(id);
          return album;
        })
      );
    } else {
      genres = await getAllGenresModel();
    }

    res.status(200).json({ genres });
  } catch (error) {
    const status = 500;
    const message = 'Something went wrong';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};

export const getGenreByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const genre = await getGenreByIdModel(id);

    res.status(200).json(genre);
  } catch (error) {
    const status = 500;
    const message = 'Something went wrong';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};

export const deleteGenreByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const genre = await deleteGenreByIdModel(id);

    res.status(200).json(genre);
  } catch (error) {
    const status = 500;
    const message = 'Something went wrong';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};

export const deleteAllGenresController = async (
  req: Request,
  res: Response
) => {
  try {
    const genres = await deleteAllGenresModel();

    res.status(200).json(genres);
  } catch (error) {
    const status = 500;
    const message = 'Something went wrong';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};

export const updateGenreByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { name, active } = req.body;

  try {
    const genre = await updateGenreByIdModel(id, name, active);

    res.status(200).json(genre);
  } catch (error) {
    const status = 500;
    const message = 'Something went wrong';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};
