import { Request, Response } from 'express';

import crypto from 'crypto';
import { createTrackModel } from '../models';

export const createTrackController = async (req: Request, res: Response) => {
  const { name, file, duration, track_number, albumId, artists, user } =
    req.body;

  if (!name) {
    const status = 400;
    const message = 'Name is required';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
    return;
  }

  const id = crypto.randomBytes(16).toString('hex');
  const main = {
    artistId: user.id,
    role: 'MAIN',
  };

  artists.push(main);

  try {
    const track = await createTrackModel(
      id,
      name,
      file,
      duration,
      track_number,
      albumId,
      artists
    );
    res.status(201).json(track);
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
