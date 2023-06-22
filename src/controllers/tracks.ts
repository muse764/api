import { Request, Response } from 'express';
import {
  addTracksArtistsModel,
  getSeveralTracksModel,
  getTracksModel,
  removeTracksArtistsModel,
  updateTrackDetailsModel,
} from '../models';

export const getTracksController = async (req: Request, res: Response) => {
  try {
    const { track_id } = req.params;
    const track = await getTracksModel(track_id);

    if (!track) {
      const status = 404;
      const message = `Track not found`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    return res.status(200).json(track);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const getSeveralTracksController = async (
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
      const tracks = await getSeveralTracksModel(Number(limit), Number(offset));
      return res.status(200).json({
        limit: Number(limit),
        offset: Number(offset),
        total: tracks.length,
        tracks,
      });
    }

    if (ids) {
      const idsArray = (ids as string).split(',');

      const tracks = await getSeveralTracksModel(idsArray);
      return res.status(200).json({ tracks });
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

export const updateTrackController = async (req: Request, res: Response) => {
  try {
    const { track_id } = req.params;
    const { name, albumId, file, duration, track_number, user } = req.body;

    const userRole = user.role;

    const track = await getTracksModel(track_id);

    if (!track) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Album not found`,
        },
      });
    }

    if (userRole === 'ARTIST') {
      if (track?.artists[0].id !== user.id) {
        return res.status(403).json({
          error: {
            status: 403,
            message: `You can't update a track that you don't own`,
          },
        });
      }
    }

    const updatedTrack = await updateTrackDetailsModel(
      track_id,
      name,
      albumId,
      file,
      duration,
      track_number
    );

    return res.status(200).json(updatedTrack);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const addTracksArtistsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { track_id } = req.params;
    const { artists } = req.body;

    const track = await getTracksModel(track_id);

    if (!track) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Track not found`,
        },
      });
    }

    const updatedTrack = await addTracksArtistsModel(track_id, artists);

    return res.status(200).json(updatedTrack);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const removeTracksArtistsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { track_id } = req.params;
    const { artists } = req.body;

    const track = await getTracksModel(track_id);

    if (!track) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Track not found`,
        },
      });
    }

    const updatedTrack = await removeTracksArtistsModel(track_id, artists);

    return res.status(200).json(updatedTrack);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};
