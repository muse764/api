import { Router } from 'express';
import {
  createGenreController,
  deleteAllGenresController,
  deleteGenreByIdController,
  getAllGenresController,
  getGenreByIdController,
  updateGenreByIdController,
} from '../controllers';

export default (router: Router) => {
  router.get('/genres', getAllGenresController);
  router.get('/genres/:id', getGenreByIdController);
  router.post('/genres', createGenreController);
  router.delete('/genres', deleteAllGenresController);
  router.delete('/genres/:id', deleteGenreByIdController);
  router.put('/genres/:id', updateGenreByIdController);
};
