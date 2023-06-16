import crypto from 'crypto';
import { Request, Response } from 'express';
import {
  createImageModel,
  deleteImageByIdModel,
  getAllImagesModel,
  getImageByIdModel,
} from '../models';

import fs from 'fs';
import { imageSize } from 'image-size';

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

    if (
      type !== 'png' &&
      type !== 'jpg' &&
      type !== 'jpeg' &&
      type !== 'gif' &&
      type !== 'webp'
    ) {
      return res.status(400).json({
        message: 'invalid file type',
      });
    }

    const id = crypto.randomBytes(16).toString('hex');

    const FOLDER = `public/users/${userId}/images`;

    // check if folder exists, if not create it
    if (!fs.existsSync(FOLDER)) {
      fs.mkdirSync(FOLDER, { recursive: true });
    }

    // convert base64 string file to buffer
    const buffer = Buffer.from(file.split(';base64,').pop(), 'base64');
    // const decodedString = buffer.toString('utf-8');

    const dimension = imageSize(buffer);
    const width = dimension.width;
    const height = dimension.height;

    const upload = fs.writeFile(
      `${FOLDER}/${id}.${type}`,
      buffer,
      { encoding: 'base64' },
      (err) => {}
    );

    const image = await createImageModel(
      id,
      `${FOLDER}/${id}.${type}`,
      width ?? 0,
      height ?? 0,
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

export const deleteImageController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const image = await getImageByIdModel(id);

    if (!image) {
      return res.status(400).json({
        message: 'image does not exist',
      });
    }

    fs.unlinkSync(image.file);

    await deleteImageByIdModel(id);

    return res.status(200).json({
      message: 'image deleted successfully',
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
