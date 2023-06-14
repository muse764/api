import { type Router } from 'express';
import { getAllTracksController } from '../controllers';

export default (router: Router) => {
  router.get('/tracks', getAllTracksController);
};
