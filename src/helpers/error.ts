import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = 500;
  const message = 'Internal Server Error';
  res.status(status).json({
    error: {
      status,
      message,
    },
  });
};
