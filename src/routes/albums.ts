import { type Router } from 'express';
import {
  createAlbumsTracksController,
  getAlbumsController,
  getAlbumsTracksController,
  getSeveralAlbumsController,
  removeAlbumsImagesController,
  removeAlbumsTracksController,
  updateAlbumDetailsController,
  uploadAlbumsImagesController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  // Get an Album
  router.get('/albums/:album_id', getAlbumsController);

  // Get Multiple Albums
  router.get('/albums', getSeveralAlbumsController);

  // Get an Album's Tracks
  router.get('/albums/:album_id/tracks', getAlbumsTracksController);

  // Update Album Details
  router.put(
    '/albums/:album_id',
    isAuthenticated,
    updateAlbumDetailsController
  );

  // Create a Track
  router.post(
    '/albums/:album_id/tracks',
    isAuthenticated,
    authorize('ARTIST'),
    createAlbumsTracksController
  );

  // Upload a Custom Album Cover Image
  router.put(
    '/albums/:album_id/images',
    isAuthenticated,
    authorize('ARTIST'),
    uploadAlbumsImagesController
  );

  // Remove Albums Tracks
  router.delete(
    '/albums/:album_id/tracks',
    isAuthenticated,
    authorize('ARTIST'),
    removeAlbumsTracksController
  );

  // Remove Albums Images
  router.delete(
    '/albums/:album_id/images',
    isAuthenticated,
    authorize('ARTIST'),
    removeAlbumsImagesController
  );
};
