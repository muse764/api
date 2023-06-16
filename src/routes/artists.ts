import { Router } from 'express';
import { getAllArtists, getSingleArtist } from '../controllers';

export default (router: Router) => {
  router.get('/artists', getAllArtists);
  router.get('/artists/:id', getSingleArtist);
  // router.get('/artists/:artistId/albums', );
  // router.get('/artists/:artistId/albums/:albumId', );
  // router.get('/artists/:artistId/tracks', );
  // router.get('/artists/:artistId/tracks/:trackId', );
  // router.get('/artists/:artistId/images', );
  // router.get('/artists/:artistId/images/:imageId', );
};
