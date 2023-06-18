import { Router } from 'express';

import albums from './albums';
import artists from './artists';
import auth from './authentication';
import genres from './genres';
import me from './me';
import playlists from './playlists';
import tracks from './tracks';
import users from './users';

import { PrismaClient } from '@prisma/client';
import { authorize, isAuthenticated } from '../middlewares';

const prisma = new PrismaClient();

const router = Router();

export default (): Router => {
  albums(router);
  artists(router);
  auth(router);
  genres(router);
  me(router);
  playlists(router);
  tracks(router);
  users(router);

  router.get('/status', (req, res) => {
    return res.status(200).json({ status: 'OK' });
  });
  router.get(
    '/stats',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    async (req, res) => {
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
    }
  );
  return router;
};
