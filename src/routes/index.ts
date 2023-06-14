import { Router } from 'express';

import albums from './albums';
import artists from './artists';
import auth from './authentication';
import genres from './genres';
import images from './images';
import me from './me';
import users from './users';
import tracks from './tracks';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();

export default (): Router => {
  users(router);
  auth(router);
  artists(router);
  albums(router);
  genres(router);
  images(router);
  tracks(router);
  me(router);
  router.get('/status', (req, res) => {
    return res.status(200).json({ status: 'OK' });
  });
  router.get('/stats', async (req, res) => {
    const users = await prisma.user.count({
      where: {
        role: 'USER',
      },
    });
    const artists = await prisma.user.count({
      where: {
        role: 'ARTIST',
      },
    });
    const albums = await prisma.album.count();
    const genres = await prisma.genre.count();
    const tracks = await prisma.track.count();
    const images = await prisma.image.count();
    const playlists = await prisma.playlist.count();
    return res.status(200).json({
      albums,
      artists,
      genres,
      images,
      playlists,
      tracks,
      users,
    });
  });
  return router;
};
