import { type Router } from 'express';
import {
  createTrackController,
  getAllTrackByIdController,
  getAllTracksController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  router.get('/tracks', getAllTracksController);
  router.get('/tracks/:id', getAllTrackByIdController);
  router.post(
    '/tracks',
    isAuthenticated,
    authorize('ARTIST'),
    createTrackController
  );
  // router.delete('/tracks', isAuthenticated, authorize('SUPERADMIN'), )
  // router.delete('/tracks/:id', isAuthenticated, authorize('ARTIST'), )
  // router.put('/tracks', isAuthenticated, authorize('ARTIST', 'MODERATOR, 'ADMIN', 'SUPERADMIN'), )
};
