import { type Router } from 'express';

import {
  createUserController,
  deleteSingleUserController,
  getAllUsersController,
  getSingleUserController,
  updateSingleUserController,
} from '../controllers';
import { authorize, isAuthenticated } from '../middlewares';

export default (router: Router) => {
  router.get(
    '/users',
    isAuthenticated,
    authorize('ADMIN', 'MODERATOR', 'SUPERADMIN'),
    getAllUsersController
  );
  router.get(
    '/users/:id',
    isAuthenticated,
    authorize('ADMIN', 'MODERATOR', 'SUPERADMIN'),
    getSingleUserController
  );
  router.post(
    '/users',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    createUserController
  );
  router.put(
    '/users/:id',
    isAuthenticated,
    authorize('ADMIN', 'MODERATOR', 'SUPERADMIN'),
    updateSingleUserController
  );
  router.delete(
    '/users/:id',
    isAuthenticated,
    authorize('ADMIN', 'SUPERADMIN'),
    deleteSingleUserController
  );
};
