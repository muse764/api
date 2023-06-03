import {
  createArtist,
  deleteArtistById,
  getArtistById,
  getArtists,
  updateArtistById,
} from '../models';

import crypto from 'crypto';

export const getAllArtists = async (req: any, res: any) => {
  try {
    const artists = await getArtists();
    res.json({
      artists: artists,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

export const getSingleArtist = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const artist = await getArtistById(id);
    res.json(artist);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

export const createSingleArtist = async (req: any, res: any) => {
  try {
    const { name } = req.body;
    const id = crypto.randomBytes(22).toString('hex');
    const artist = await createArtist(id, name);
    res.json(artist);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

export const deleteSingleArtist = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const artist = await deleteArtistById(id);
    res.json(artist);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};
