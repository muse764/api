import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Something went wrong';
  res.status(status).json({
    error: {
      status,
      message,
    },
  });
};
