import { Request, Response, Router } from 'express';
import { isAuthenticated } from '../middlewares';


export default (router: Router) => {
  router.get('/me', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { user } = req.body;
      return res.status(200).json({ user });
    } catch (error) {
      const status = 500;
      const message = 'Internal Server Error';
      return res.status(status).json({
        error: {
        status,
        message,
      },
      });
    }
  });
};
