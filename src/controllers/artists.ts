import { Request, Response } from 'express';
import {
  createArtistsAlbumsModel,
  getArtistsAlbumsModel,
  getArtistsModel,
  getArtistsTracksModel,
  getSeveralArtistsModel,
} from '../models';
import { randomUUID } from 'crypto';

export const getArtistsController = async (req: Request, res: Response) => {
  try {
    const { artist_id } = req.params;
    const artist = await getArtistsModel(artist_id);

    if (!artist) {
      const status = 404;
      const message = `Artist not found`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    return res.status(200).json(artist);
  } catch (error: any) {
    return res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
};

export const getSeveralArtistsController = async (
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
      const artists = await getSeveralArtistsModel(
        Number(limit),
        Number(offset)
      );
      return res.status(200).json({ artists });
    }

    if (ids) {
      const idsArray = (ids as string).split(',');

      const artists = await getSeveralArtistsModel(idsArray);
      return res.status(200).json({ artists });
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

export const getArtistsAlbumsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { artists_id } = req.params;
    const { limit, offset } = req.query;

    if (!limit || !offset) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You must use limit and offset`,
        },
      });
    }

    const albums = await getArtistsAlbumsModel(
      artists_id,
      Number(limit),
      Number(offset)
    );

    return res.status(200).json({
      limit,
      offset,
      total: albums?.albums.length,
      albums: albums?.albums,
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

export const getArtistsTracksController = async (
  req: Request,
  res: Response
) => {
  try {
    const { artist_id } = req.params;
    const { limit, offset } = req.query;

    if (!limit || !offset) {
      return res.status(400).json({
        error: {
          status: 400,
          message: `You must use limit and offset`,
        },
      });
    }

    const tracks = await getArtistsTracksModel(
      artist_id,
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

export const createArtistsAlbumsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { artist_id } = req.params;
    const { albums, user } = req.body;

    if (artist_id !== user.id) {
      const status = 403;
      const message = `You can't create an album for another user`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    albums.map((album: any) => {
      const album_id = randomUUID();
      album.id = album_id;
    });

    const album = await createArtistsAlbumsModel(artist_id, albums);
    return res.status(201).json(album);
  } catch (error) {
    console.log(error);
  }
};
