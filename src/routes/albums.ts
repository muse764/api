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
  router.get('/albums/', isAuthenticated, authorize('ADMIN', 'ARTIST', 'MODERATOR', 'SUPERADMIN', 'USER'), getAlbumsController);
  router.get('/albums/:id', getAlbumByIdController);
  // router.get('/albums/:id/tracks', );
  router.post('/albums/', createAlbumController);
  router.delete('/albums/', deleteAllAlbumsController);
  router.delete('/albums/:id', deleteAlbumByIdController);
  router.put('/albums/:id', updateAlbumByIdController);
};
