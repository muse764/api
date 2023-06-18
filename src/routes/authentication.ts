import { Router } from 'express';

import { login, register } from '../controllers';

export default (router: Router) => {
  // login
  router.post('/auth/login', login);
  // register
  router.post('/auth/register', register);
};
