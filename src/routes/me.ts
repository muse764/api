import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';

import { getUserById } from '../models';

export default (router: Router) => {
  router.get('/me', async (req: Request, res: Response) => {
    try {
      
    
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        data: null,
        success: false,
        message: 'Unauthorized',
      });
    }

    const decoded = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!);

    if (!decoded) {
      return res.status(401).json({
        data: null,
        success: false,
        message: 'Unauthorized',
      });
    }

    const { userId } = decoded as any;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        data: null,
      });
    }

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
