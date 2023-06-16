import { Request, Response } from 'express';
import fs from 'fs';
import getAudioDurationInSeconds from 'get-audio-duration';
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
  const { name, release_date, type, tracks, artists, user } = req.body;

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

  artists.push(userId);

  const id = crypto.randomBytes(16).toString('hex');

  try {
    await tracks.map(async (track: any) => {
      const trackId = crypto.randomBytes(16).toString('hex');
      track.id = trackId;

      // check file extension of base64 string
      var type = track.file.split(';')[0].split('/')[1];

      if (
        type !== 'mp3' &&
        type !== 'wav' &&
        type !== 'opus' &&
        type !== 'webm'
      ) {
        return res.status(400).json({
          message: 'invalid file type',
        });
      }

      // convert base64 string file to buffer
      const buffer = Buffer.from(track.file.split(';base64,').pop(), 'base64');
      // const decodedString = buffer.toString('utf-8');

      const FOLDER = `public/users/${user.id}/albums/${id}/tracks`;
      const FILE = `${FOLDER}/${trackId}.${type}`;

      // check if folder exists, if not create it
      if (!fs.existsSync(FOLDER)) {
        fs.mkdirSync(FOLDER, { recursive: true });
      }

      if (fs.existsSync(FOLDER)) {
        const upload = fs.writeFileSync(FILE, buffer, {
          encoding: 'base64',
        });
      }

      track.file = FILE;

      track.duration = await getAudioDurationInSeconds(FILE);

      track.track_number = parseInt(track.track_number);
    });

    const album = await createAlbumModel(
      id,
      name,
      release_date,
      type,
      artists,
      tracks
    );
    res.status(201).json(album);
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
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
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
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
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
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
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
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
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
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
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};
