import { type Router } from 'express';
import {
  addAlbumsArtistsController,
  addAlbumsGenresController,
  createAlbumsTracksController,
  getAlbumsController,
  getAlbumsTracksController,
  getSeveralAlbumsController,
  removeAlbumsArtistsController,
  removeAlbumsGenresController,
  removeAlbumsImagesController,
  removeAlbumsTracksController,
  updateAlbumDetailsController,
  uploadAlbumsImagesController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  // Create an Album
  router.get('/albums/:album_id', getAlbumsController);

  // Get Multiple Albums
  router.get('/albums', getSeveralAlbumsController);

  // Get an Album's Tracks
  router.get('/albums/:album_id/tracks', getAlbumsTracksController);

  // Update Album Details
  router.put(
    '/albums/:album_id',
    isAuthenticated,
    authorize('ARTIST', 'MODERATOR', 'ADMIN', 'SUPERADMIN'),
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

  // Add Albums Genres
  router.post(
    '/albums/:album_id/genres',
    isAuthenticated,
    authorize('ARTIST'),
    addAlbumsGenresController
  );

  // Remove Albums Genres
  router.delete(
    '/albums/:album_id/genres',
    isAuthenticated,
    authorize('ARTIST'),
    removeAlbumsGenresController
  );

  // Add Albums Artists
  router.post(
    '/albums/:album_id/artists',
    isAuthenticated,
    authorize('ARTIST'),
    addAlbumsArtistsController
  );

  // Remove Albums Artists
  router.delete(
    '/albums/:album_id/artists',
    isAuthenticated,
    authorize('ARTIST'),
    removeAlbumsArtistsController
  );
};
