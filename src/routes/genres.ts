import { type Router } from 'express';
import {
  createGenresController,
  deleteGenresController,
  deleteSeveralGenresController,
  getGenresController,
  getSeveralGenresController,
  updateGenresController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  // Get Several Genres
  router.get('/genres', getSeveralGenresController);
  // Get a Genre
  router.get('/genres/:genre_id', getGenresController);
  // Create a Genre
  router.post(
    '/genres',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    createGenresController
  );
  // Update a Genre
  router.put(
    '/genres/:genre_id',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    updateGenresController
  );
  // Delete a Genre
  router.delete(
    '/genres/:genre_id',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    deleteGenresController
  );
  // Delete several genres
  router.delete(
    '/genres',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    deleteSeveralGenresController
  );
};
