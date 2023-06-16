import { Router } from 'express';
import {
  createAlbumController,
  deleteAlbumByIdController,
  deleteAllAlbumsController,
  getAlbumByIdController,
  getAlbumsController,
  updateAlbumByIdController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  router.get('/albums/', getAlbumsController);
  router.get('/albums/:id', getAlbumByIdController);
  router.post(
    '/albums/',
    isAuthenticated,
    authorize('ARTIST'),
    createAlbumController
  );
  // router.get('/albums/:albumId/tracks', );
  // router.get('/albums/:albumId/tracks/:trackId', );
  // router.post('/albums/:albumId/artists', );
  // router.post('/albums/:albumId/artists/:artistId', );
  // router.post('/albums/:albumId/images', );
  // router.post('/albums/:albumId/images/:imageId', );
  // router.post('/albums/:albumId/genres', );
  // router.post('/albums/:albumId/genres/:genreId', );
  router.delete(
    '/albums/',
    isAuthenticated,
    authorize('SUPERADMIN'),
    deleteAllAlbumsController
  );
  router.delete(
    '/albums/:id',
    isAuthenticated,
    authorize('ARTIST', 'ADMIN', 'SUPERADMIN'),
    deleteAlbumByIdController
  );
  router.put(
    '/albums/:id',
    isAuthenticated,
    authorize('ARTIST', 'MODERATOR', 'ADMIN', 'SUPERADMIN'),
    updateAlbumByIdController
  );
};
