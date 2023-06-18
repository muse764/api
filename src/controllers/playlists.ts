import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import fs from 'fs';
import imageSize from 'image-size';
import {
  addPlaylistsTracksModel,
  getPlaylistModel,
  getPlaylistsTracksModel,
  getSeveralPlaylistsModel,
  removePlaylistsImagesModel,
  removePlaylistsTracksModel,
  updatePlaylistDetailsModel,
  uploadPlaylistsImagesModel,
} from '../models';

export const getPlaylistController = async (req: any, res: any) => {
  try {
    const { playlist_id } = req.params;
    const playlist = await getPlaylistModel(playlist_id);

    if (!playlist) {
      const status = 404;
      const message = `Playlist not found`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    return res.status(200).json(playlist);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const getSeveralPlaylistsController = async (req: any, res: any) => {
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
      const playlists = await getSeveralPlaylistsModel(
        Number(limit),
        Number(offset)
      );
      return res.status(200).json({ playlists });
    }

    if (ids) {
      const idsArray = (ids as string).split(',');

      const playlists = await getSeveralPlaylistsModel(idsArray);
      return res.status(200).json({ playlists });
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

export const getPlaylistsTracksController = async (req: any, res: any) => {
  try {
    const { playlist_id } = req.params;
    const { limit, offset } = req.query;

    if (!limit || !offset) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You must use limit and offset`,
        },
      });
    }

    const tracks = await getPlaylistsTracksModel(
      playlist_id,
      Number(limit),
      Number(offset)
    );

    return res.status(200).json({
      limit,
      offset,
      total: tracks?.tracks.length,
      tracks: tracks?.tracks,
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

export const updatePlaylistDetailsController = async (req: any, res: any) => {
  try {
    const { playlist_id } = req.params;
    const { name, description, user } = req.body;

    const playlist = await getPlaylistModel(playlist_id);

    console.log(name);

    if (!playlist) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Playlist not found`,
        },
      });
    }

    if (playlist.owner.id !== user.id) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a playlist that you don't own`,
        },
      });
    }

    const updatedPlaylist = await updatePlaylistDetailsModel(
      playlist_id,
      name,
      description
    );

    return res.status(200).json(updatedPlaylist);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const uploadPlaylistsImagesController = async (req: any, res: any) => {
  try {
    const { playlist_id } = req.params;
    const { images, user } = req.body;

    const playlist = await getPlaylistModel(playlist_id);

    if (!playlist) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Playlist not found`,
        },
      });
    }

    if (playlist.owner.id !== user.id) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a playlist that you don't own`,
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

      const FOLDER = `public/users/${user.id}/playlists/${playlist_id}/images`;

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

    const updatedPlaylist = await uploadPlaylistsImagesModel(
      playlist_id,
      images
    );

    return res.status(200).json({ updatedPlaylist });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const addPlaylistsTracksController = async (
  req: Request,
  res: Response
) => {
  try {
    const { playlist_id } = req.params;
    const { tracks, user } = req.body;

    const playlist = await getPlaylistModel(playlist_id);

    if (!playlist) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Playlist not found`,
        },
      });
    }

    if (playlist.owner.id !== user.id) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a playlist that you don't own`,
        },
      });
    }
    const updatedPlaylist = await addPlaylistsTracksModel(playlist_id, tracks);
    return res.status(200).json({ updatedPlaylist });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const removePlaylistsTracksController = async (
  req: Request,
  res: Response
) => {
  try {
    const { playlist_id } = req.params;
    const { tracks, user } = req.body;

    const playlist = await getPlaylistModel(playlist_id);

    if (!playlist) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Playlist not found`,
        },
      });
    }

    if (playlist.owner.id !== user.id) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a playlist that you don't own`,
        },
      });
    }
    const updatedPlaylist = await removePlaylistsTracksModel(
      playlist_id,
      tracks
    );
    return res.status(200).json({ updatedPlaylist });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const removePlaylistsImagesController = async (req: any, res: any) => {
  try {
    const { playlist_id } = req.params;
    const { images, user } = req.body;

    const playlist = await getPlaylistModel(playlist_id);

    if (!playlist) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Playlist not found`,
        },
      });
    }

    if (playlist.owner.id !== user.id) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `You can't update a playlist that you don't own`,
        },
      });
    }
    const updatedPlaylist = await removePlaylistsImagesModel(
      playlist_id,
      images
    );

    images.map(async (image: any) => {
      const FOLDER = `public/users/${user.id}/playlists/${playlist_id}/images`;
      const files = fs.readdirSync(FOLDER);
      files.map((file: any) => {
        if (file.startsWith(image)) {
          fs.unlink(`${FOLDER}/${file}`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      });
    });

    return res.status(200).json({ updatedPlaylist });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};
