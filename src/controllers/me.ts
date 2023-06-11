import { Request, Response } from "express";

export const getLoggedinUser = async (req: Request, res: Response) => {
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
  }