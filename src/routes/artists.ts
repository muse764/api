import { Router } from 'express';
import {
  getAllArtists,
  getSingleArtist,
} from '../controllers';

export default (router: Router) => {
  router.get('/artists', getAllArtists);
  router.get('/artists/:id', getSingleArtist);
};
