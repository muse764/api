import { Router, Request, Response } from 'express';

export default (router: Router) => {
  router.get('/albums/', async (req: Request, res: Response) => {
    res.status(200).json({
      data: [
        {
          id: '',
          name: '',
          type: 'album',
          total_tracks: 10,
          tracks: [],
          images: [],
          release_date: '1990',
          genres: [],
          artists: [],
        },
        {
          id: '',
          name: '',
          type: 'single',
          total_tracks: 1,
          tracks: [],
          images: [],
          release_date: '1990',
          genres: [],
          artists: [],
        },
        {
          id: '',
          name: '',
          type: 'compilation',
          total_tracks: 10,
          tracks: [],
          images: [],
          release_date: '1990',
          genres: [],
          artists: [],
        },
      ],
      success: true,
      message: 'Operation completed successfully',
    });
  });
  router.get('/albums/:id', async (req: Request, res: Response) => {
    res.status(200).json({
      data: {
        id: '',
        name: '',
        type: 'album',
        total_tracks: 10,
        tracks: [],
        images: [],
        release_date: '1990',
        genres: [],
        artists: [],
      },
      success: true,
      message: 'Operation completed successfully',
    });
  });
  router.get('/albums/:id/tracks', async (req: Request, res: Response) => {
    res.status(200).json({
      data: {
        total: 10,
        tracks: [],
      },
      success: true,
      message: 'Operation completed successfully',
    });
  });
};
