import { type Router } from 'express';
import {
  addTracksArtistsController,
  getSeveralTracksController,
  getTracksController,
  removeTracksArtistsController,
  updateTrackController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  // Get a Track
  router.get('/tracks/:track_id', getTracksController);

  // Get Multiple Tracks
  router.get('/tracks', getSeveralTracksController);

  // Update Track Details
  router.put(
    '/tracks/:track_id',
    isAuthenticated,
    authorize('ARTIST', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'),
    updateTrackController
  );

  // Add Track Artists
  router.post(
    '/tracks/:track_id/artists',
    isAuthenticated,
    authorize('ARTIST'),
    addTracksArtistsController
  );

  // Remove Track Artists
  router.delete(
    '/tracks/:track_id/artists',
    isAuthenticated,
    authorize('ARTIST'),
    removeTracksArtistsController
  );
};
