import { type Router } from 'express';
import {
  createCategoriesController,
  deleteCategoriesController,
  deleteSeveralCategoriesController,
  getCategoriesController,
  getSeveralCategoriesController,
  updateCategoriesController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  // Get several categories
  router.get('/categories', getSeveralCategoriesController);
  // Get a category
  router.get('/categories/:category_id', getCategoriesController);
  // Create a category
  router.post(
    '/categories',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    createCategoriesController
  );
  // Update a category
  router.put(
    '/categories/:category_id',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    updateCategoriesController
  );
  // Delete a category
  router.delete(
    '/categories/:category_id',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    deleteCategoriesController
  );
  // Delete several categories
  router.delete(
    '/categories',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    deleteSeveralCategoriesController
  );
};
