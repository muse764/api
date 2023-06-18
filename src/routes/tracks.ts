import { type Router } from 'express';
import {
  getSeveralTracksController,
  getTracksController,
  updateTrackController,
} from '../controllers';
import { isAuthenticated } from '../middlewares';

export default (router: Router) => {
  // Get a Track
  router.get('/tracks/:track_id', getTracksController);

  // Get Multiple Tracks
  router.get('/tracks', getSeveralTracksController);

  // Update Track Details
  router.put('/tracks/:track_id', isAuthenticated, updateTrackController);
};
