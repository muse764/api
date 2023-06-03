import { Router } from 'express';

import users from './users';
import auth from './authentication';
import artists from './artists';
import me from './me';

const router = Router();

export default (): Router => {
  users(router);
  auth(router);
  artists(router);
  me(router);
  return router;
};
