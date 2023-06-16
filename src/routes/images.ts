import { Router } from 'express';
import {
  createImageController,
  deleteImageController,
  getImageByIdController,
  getImagesController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  router.get(
    '/images',
    isAuthenticated,
    authorize('ADMIN', 'MODERATOR', 'SUPERADMIN'),
    getImagesController
  );
  router.get(
    '/images/:id',
    isAuthenticated,
    authorize('MODERATOR', 'ADMIN', 'SUPERADMIN'),
    getImageByIdController
  );
  router.post(
    '/images',
    isAuthenticated,
    authorize('USER', 'ARTIST', 'MODERATOR', 'ADMIN', 'SUPERADMIN'),
    createImageController
  );
  router.delete(
    '/images/:id',
    isAuthenticated,
    authorize('USER', 'ARTIST', 'MODERATOR', 'ADMIN', 'SUPERADMIN'),
    deleteImageController
  );
};
