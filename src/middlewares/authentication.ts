import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { merge } from 'lodash';
import { getUserByIdModel } from '../models';

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const token = authorization?.split(' ')[1];

  if (!token) {
    const status = 403;
    const message = `Forbidden`;
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }

  const decoded = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!);

  if (!decoded) {
    const status = 403;
    const message = `Forbidden`;
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }

  const { userId } = decoded as any;

  const user = await getUserByIdModel(userId);

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
};

export default isAuthenticated;
