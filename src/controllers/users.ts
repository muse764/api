import { Request, Response } from 'express';

import { encryptPassword } from '../helpers';
import {
  deleteUserByIdModel,
  getUserByIdModel,
  getUsersModel,
  updateUserByIdModel,
} from '../models';

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getUsersModel();
    res.status(200).json({
      users,
    });
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
};

export const getSingleUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || id.length < 20) {
      const status = 400;
      const message = 'invalid id';
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    const user = await getUserByIdModel(id);

    if (!user) {
      const status = 404;
      const message = `Non existing id: 'user:${id}'`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    res.status(200).json(user);
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
};

export const updateSingleUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    const user = await getUserByIdModel(id);

    if (!user) {
      const status = 400;
      const message = `User not found`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    let hashed_password = password;

    if (password) {
      hashed_password = await encryptPassword(password);
    }

    const updated_user = await updateUserByIdModel(
      id,
      username ?? user.username,
      email ?? user.email,
      hashed_password ?? user.password,
      role ?? user.role
    );

    return res.status(200).json({
      updated_user,
    });
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
};

export const deleteSingleUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || id.length < 20) {
      const status = 400;
      const message = 'invalid id';
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    const user = await getUserByIdModel(id);

    if (!user) {
      const status = 404;
      const message = `Non existing id: 'user:${id}'`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    await deleteUserByIdModel(id);

    return res.status(200).json({});
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
};
