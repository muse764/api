import { Router } from 'express';
import fs from 'fs';

import albums from './albums';
import artists from './artists';
import auth from './authentication';
import categories from './categories';
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
  categories(router);
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
  router.get('/media', (req, res) => {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ error: 'No media specified' });
    }

    const media = fs.readFileSync(`${path}`);

    return res.status(200).send(media);
  });

  return router;
};
