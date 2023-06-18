import { type Router } from 'express';
import {
  createArtistsAlbumsController,
  getArtistsAlbumsController,
  getArtistsController,
  getArtistsTracksController,
  getSeveralArtistsController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  // Get an Artist
  router.get('/artists/:artist_id', getArtistsController);

  // Get Multiple Artists
  router.get('/artists', getSeveralArtistsController);

  // Get an Artist's Albums
  router.get('/artists/:artist_id/albums', getArtistsAlbumsController);

  // Get an Artist's Tracks
  router.get('/artists/:artist_id/albums', getArtistsTracksController);

  // Create an Album
  router.post(
    '/artists/:artist_id/albums',
    isAuthenticated,
    authorize('ARTIST'),
    createArtistsAlbumsController
  );
};
