import { Router } from 'express';
import {
  getAllArtists,
  createSingleArtist,
  getSingleArtist,
  deleteSingleArtist,
} from '../controllers';

export default (router: Router) => {
  router.get('/artists', getAllArtists);
  router.get('/artists/:id', getSingleArtist);
  router.post('/artists', createSingleArtist);
  router.delete('/artists/:id', deleteSingleArtist);
};
