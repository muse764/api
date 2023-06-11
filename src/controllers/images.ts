import crypto from 'crypto';
import { Request, Response } from 'express';
import { createImageModel, getImageByIdModel } from '../models';

import fs from 'fs';

export const createImageController = async (req: Request, res: Response) => {
  const { file, user } = req.body;

  const userId = user.id;

  try {
    // convert base64 string file to buffer
    const buffer = Buffer.from(file.split(';base64,').pop(), 'base64');
    const decodedString = buffer.toString('utf-8');

    const type = file.split(';')[0].split('/')[1];

    const id = crypto.randomBytes(16).toString('hex');

    const upload = fs.writeFile(
      `public/${id}.${type}`,
      buffer,
      { encoding: 'base64' },
      (err) => {}
    );

    const image = await createImageModel(id, `public/${id}.${type}`, 200, 200, userId);

    return res.status(200).json({
      image,
    });
  } catch (error) {
    const status = 500;
    const message = 'Internal server error';
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};

export const getImageByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const image = await getImageByIdModel(id);

    if (!image) {
      return res.status(400).json({
        message: 'image does not exist',
      });
    }

    // const file = fs.readFile(image.file, (err) => {});

    const file_content = fs.readFileSync(image.file, {
      encoding: 'base64',
    });

    return res.status(400).json({
      file_content,
    });
  } catch (error) {
    const status = 500;
    const message = 'Internal server error';
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};
