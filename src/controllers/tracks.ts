import { Request, Response } from 'express';

import crypto from 'crypto';
import fs from 'fs';
import getAudioDurationInSeconds from 'get-audio-duration';
import {
  createTrackModel,
  getAllTracksModel,
  getTrackByIdModel,
} from '../models';

export const createTrackController = async (req: Request, res: Response) => {
  const { name, file, track_number, albumId, artists, user } = req.body;

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
    // check file extension of base64 string
    var type = file.split(';')[0].split('/')[1];

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
    const buffer = Buffer.from(file.split(';base64,').pop(), 'base64');
    // const decodedString = buffer.toString('utf-8');

    const id = crypto.randomBytes(16).toString('hex');

    const FOLDER = `public/users/${user.id}/albums/${albumId}/tracks`;

    // check if folder exists, if not create it
    if (!fs.existsSync(FOLDER)) {
      fs.mkdirSync(FOLDER, { recursive: true });
    }

    const upload = fs.writeFileSync(`${FOLDER}/${id}.${type}`, buffer, {
      encoding: 'base64',
    });

    const duration = await getAudioDurationInSeconds(`${FOLDER}/${id}.${type}`);

    const ntrack_number = parseInt(track_number);

    // check if folder exists and f it does not exists create it

    const track = await createTrackModel(
      id,
      name,
      `${FOLDER}/${id}.${type}`,
      duration,
      ntrack_number,
      albumId,
      artists
    );
    res.status(201).json(track);
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

export const getAllTracksController = async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;

    var tracks;

    if (limit && offset) {
      tracks = await getAllTracksModel(Number(limit), Number(offset));
    }

    if (limit && !offset) {
      tracks = await getAllTracksModel(Number(limit), 0);
    }

    if (!limit && offset) {
      tracks = await getAllTracksModel(20, Number(offset));
    }

    if (!limit && !offset) {
      tracks = await getAllTracksModel(Number(limit) | 20, Number(offset) | 0);
    }
    res.status(200).json({ tracks });
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

export const getAllTrackByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const track = await getTrackByIdModel(id);
    res.status(200).json({ track });
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
