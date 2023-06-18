import { Router } from 'express';

import { login, refresh, register } from '../controllers';

export default (router: Router) => {
  // login
  router.post('/auth/login', login);
  // register
  router.post('/auth/register', register);
  // logout
  router.post('/auth/logout', (req, res) => {});
  // refresh token
  router.post('/auth/refresh', refresh);
};
