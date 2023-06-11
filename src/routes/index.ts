import { Router } from 'express';

import albums from './albums';
import artists from './artists';
import auth from './authentication';
import genres from './genres';
import images from './images';
import me from './me';
import users from './users';

const router = Router();

export default (): Router => {
  users(router);
  auth(router);
  artists(router);
  albums(router);
  genres(router);
  images(router);
  me(router);
  router.get('/status', (req, res) => {
    return res.status(200).json({ status: 'OK' });
  });
  return router;
};
