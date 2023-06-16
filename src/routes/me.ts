import { Request, Response, Router } from 'express';
import { isAuthenticated } from '../middlewares';
import { getLoggedinUser } from '../controllers';

export default (router: Router) => {
  router.get('/me', isAuthenticated, getLoggedinUser);
};
