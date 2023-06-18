import { type Router } from 'express';

export default (router: Router) => {
  router.get('/genres', (req, res) => {
    res.send('Genres');
  });
};
