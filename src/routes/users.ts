import { type Router } from 'express';

import {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
} from '../controllers';

export default (router: Router) => {
  router.get('/users', getAllUsers);
  router.get('/users/:id', getSingleUser);
  router.put('/users/:id', updateSingleUser);
  router.delete('/users/:id', deleteSingleUser);
};
