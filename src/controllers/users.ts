import { Request, Response } from 'express';

import { randomUUID } from 'crypto';
import fs from 'fs';
import imageSize from 'image-size';
import {
  createUsersPlaylistModel,
  getSeveralUsersModel,
  getUsersPlaylistsModel,
  getUsersProfileModel,
  updateUsersProfileModel,
  uploadUsersImagesModel,
} from '../models';

export const getUsersProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = req.params;
    const user = await getUsersProfileModel(user_id);
    return res.status(200).json({ user });
  } catch (error) {}
};

export const getSeveralUsersController = async (
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
      const users = await getSeveralUsersModel(Number(limit), Number(offset));
      return res.status(200).json({ users });
    }

    if (ids) {
      const idsArray = (ids as string).split(',');

      const users = await getSeveralUsersModel(idsArray);
      return res.status(200).json({ users });
    }
  } catch (error) {}
};

export const getUsersPlaylistsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = req.params;
    const { limit, offset } = req.query;
    if (!limit || !offset) {
      const status = 400;
      const message = `limit and offset must be used at the same time`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }
    const playlists = await getUsersPlaylistsModel(
      user_id,
      Number(limit),
      Number(offset)
    );
    return res.status(200).json({
      limit,
      offset,
      total: playlists!.playlists.length,
      playlists: playlists!.playlists,
    });
  } catch (error: any) {
    const status = 500;
    const message = `Internal server error: ${error.message}`;
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};

export const createUsersPlaylistController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = req.params;
    const { name, description, user } = req.body;
    if (user_id !== user.id) {
      const status = 403;
      const message = `You can't create a playlist for another user`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (!name || !description) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `Please provide all required fields`,
        },
      });
    }

    const id = randomUUID();

    const playlist = await createUsersPlaylistModel(
      id,
      name,
      description,
      user_id
    );
    return res.status(201).json(playlist);
  } catch (error) {}
};

export const uploadUsersImagesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = req.params;
    const { images, user } = req.body;

    if (user_id !== user.id) {
      const status = 403;
      const message = `You can't upload an image for another user`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    images.map((image: any) => {
      const image_id = randomUUID();
      image.id = image_id;

      // check file extension of base64 string
      var type = image.file.split(';')[0].split('/')[1];

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

      const FOLDER = `public/users/${user.id}/images`;

      // check if folder exists, if not create it
      if (!fs.existsSync(FOLDER)) {
        fs.mkdirSync(FOLDER, { recursive: true });
      }

      // convert base64 string file to buffer
      const buffer = Buffer.from(image.file.split(';base64,').pop(), 'base64');
      // const decodedString = buffer.toString('utf-8');

      const dimension = imageSize(buffer);
      const width = dimension.width;
      const height = dimension.height;
      image.width = width;
      image.height = height;

      const upload = fs.writeFile(
        `${FOLDER}/${image_id}.${type}`,
        buffer,
        { encoding: 'base64' },
        (err) => {}
      );
      image.file = `${FOLDER}/${image_id}.${type}`;
    });

    const image = await uploadUsersImagesModel(user.id, images);
    return res.status(201).json(image);
  } catch (error) {
    console.log(error);
  }
};

export const updateUsersProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = req.params;
    const { full_name, username, email, password, user } = req.body;

    if (user_id !== user.id) {
      const status = 403;
      const message = `You can't update a profile for another user`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    const profile = await updateUsersProfileModel(
      user_id,
      full_name,
      username,
      email,
      password
    );
    return res.status(200).json(profile);
  } catch (error) {
    console.log(error);
  }
};
