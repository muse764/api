import { Request, Response } from 'express';

export const getLoggedinUser = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    return res.status(200).json({ user });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};
