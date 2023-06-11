import { Request, Response } from 'express';
import {
  createAlbumModel,
  deleteAlbumByIdModel,
  deleteAllAlbumsModel,
  getAlbumByIdModel,
  getAllAlbumsModel,
  updateAlbumByIdModel,
} from '../models';

import crypto from 'crypto';

export const createAlbumController = async (req: Request, res: Response) => {
  const { name, release_date, type, published, genres, artists, tracks, user } =
    req.body;

  const userId = user.id;

  if (!name) {
    const status = 400;
    const message = 'Missing name field';
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }

  if (!release_date) {
    const status = 400;
    const message = 'Missing release_date field';
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }

  const id = crypto.randomBytes(16).toString('hex');

  artists.push(userId);

  try {
    const album = await createAlbumModel(
      id,
      name,
      release_date,
      type,
      published,
      artists,
      genres,
      tracks
    );
    res.status(201).json(album);
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

export const getAlbumsController = async (req: Request, res: Response) => {
  try {
    const { ids, limit, offset } = req.query;

    var albums;

    if (ids) {
      const idsArray = (ids as string).split(',');
      albums = await Promise.all(
        idsArray.map(async (id) => {
          const album = await getAlbumByIdModel(id);
          return album;
        })
      );
    } else {
      if (limit && offset) {
        albums = await getAllAlbumsModel(Number(limit), Number(offset));
      }

      if (limit && !offset) {
        albums = await getAllAlbumsModel(Number(limit), 0);
      }

      if (!limit && offset) {
        albums = await getAllAlbumsModel(20, Number(offset));
      }

      if (!limit && !offset) {
        albums = await getAllAlbumsModel(
          Number(limit) | 20,
          Number(offset) | 0
        );
      }
    }
    res.status(200).json({
      albums,
    });
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

export const getAlbumByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const album = await getAlbumByIdModel(id);

    if (!album) {
      const status = 404;
      const message = 'Album not found';
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    res.status(200).json({
      album_type: album.type,
      total_tracks: 11,
      id: album.id,
      images: album.images,
      name: album.name,
      release_date: album.release_date,
      genres: album.genres.map((genre) => genre.name),
      artists: album.artists,
      tracks: album.tracks,
    });
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

export const updateAlbumByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { name, release_date, type, published } = req.body;

  try {
    const album = await updateAlbumByIdModel(
      id,
      name,
      release_date,
      type,
      published
    );
    res.status(200).json(album);
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

export const deleteAlbumByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const album = await deleteAlbumByIdModel(id);
    res.status(200).json(album);
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

export const deleteAllAlbumsController = async (
  req: Request,
  res: Response
) => {
  try {
    const albums = await deleteAllAlbumsModel();
    res.status(200).json(albums);
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
