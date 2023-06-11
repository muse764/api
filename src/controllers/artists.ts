import { getArtistById, getArtists } from '../models';

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
