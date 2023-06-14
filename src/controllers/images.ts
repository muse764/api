import crypto from 'crypto';
import { Request, Response } from 'express';
import {
  createImageModel,
  getAllImagesModel,
  getImageByIdModel,
} from '../models';

import fs from 'fs';

export const createImageController = async (req: Request, res: Response) => {
  const { file, user } = req.body;

  const userId = user.id;

  if (!file) {
    return res.status(400).json({
      message: 'file is required',
    });
  }

  try {
    // check file extension of base64 string
    var type = file.split(';')[0].split('/')[1];

    if (type !== 'png' && type !== 'jpg' && type !== 'jpeg') {
      return res.status(400).json({
        message: 'invalid file type',
      });
    }

    if (type === 'jpeg') {
      type = 'jpg';
    }

    // convert base64 string file to buffer
    const buffer = Buffer.from(file.split(';base64,').pop(), 'base64');
    // const decodedString = buffer.toString('utf-8');

    const id = crypto.randomBytes(16).toString('hex');

    const upload = fs.writeFile(
      `public/images/${id}.${type}`,
      buffer,
      { encoding: 'base64' },
      (err) => {}
    );

    const image = await createImageModel(
      id,
      `public/images/${id}.${type}`,
      200,
      200,
      userId
    );

    return res.status(200).json({
      image,
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

export const getImagesController = async (req: Request, res: Response) => {
  try {
    const images = await getAllImagesModel();

    images.map((image) => {
      const file_content = fs.readFileSync(image.file, {
        encoding: 'base64',
      });

      image.file = file_content;
    });

    return res.status(200).json({
      images,
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
