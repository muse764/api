import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { merge } from 'lodash';
import { getUserModel } from '../models/users';

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];

    if (!token) {
      const status = 401;
      const message = `No token provided`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    const decoded = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!);

    const { userId } = decoded as any;

    const user = await getUserModel(userId);

    if (!user) {
      const status = 403;
      const message = `Forbidden`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    merge(req.body, { user });
    next();
  } catch (error) {
    const status = 401;
    const message = `Invalid access token`;
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};

export default isAuthenticated;
