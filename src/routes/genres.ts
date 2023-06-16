import { Router } from 'express';
import {
  createGenreController,
  deleteAllGenresController,
  deleteGenreByIdController,
  getAllGenresController,
  getGenreByIdController,
  updateGenreByIdController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  router.get('/genres', getAllGenresController);
  router.get('/genres/:id', getGenreByIdController);
  router.post(
    '/genres',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    createGenreController
  );
  router.delete(
    '/genres',
    isAuthenticated,
    authorize('SUPERADMIN'),
    deleteAllGenresController
  );
  router.delete(
    '/genres/:id',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    deleteGenreByIdController
  );
  router.put(
    '/genres/:id',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    updateGenreByIdController
  );
};
