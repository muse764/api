import { NextFunction, Request, Response } from 'express';

export default function authorize(...authorizedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;

    if (user && authorizedRoles.includes(user.role)) {
      next();
    } else {
      const status = 403;
      const message = 'Forbidden';
      res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }
  };
}
