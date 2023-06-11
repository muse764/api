import { Router } from 'express';
import { createImageController, getImageByIdController } from '../controllers';
import { isAuthenticated } from '../middlewares';

export default (router: Router) => {
  router.get('/images/:id', getImageByIdController);
  router.post('/images', isAuthenticated, createImageController);
};
