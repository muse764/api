import { Request, Response } from 'express';
import {
  getCurrentUsersAlbumsModel,
  getCurrentUsersPlaylistsModel,
  getCurrentUsersProfileModel,
  getCurrentUsersTracksModel,
} from '../models';

export const getCurrentUsersProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body.user;
    const user = await getCurrentUsersProfileModel(id);
    return res.status(200).json({ user });
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

export const getCurrentUsersPlaylistsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body.user;
    const playlists = await getCurrentUsersPlaylistsModel(id);
    return res.status(200).json(playlists);
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

export const getCurrentUsersAlbumsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body.user;
    const albums = await getCurrentUsersAlbumsModel(id);
    return res.status(200).json(albums);
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

export const getCurrentUsersTracksController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body.user;
    const tracks = await getCurrentUsersTracksModel(id);
    return res.status(200).json(tracks);
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
