import { Request, Response } from 'express';

import { encryptPassword, comparePassword } from '../helpers';
import {
  getUsers,
  getUserById,
  updateUserById,
  getUserByIdWithPassword,
  deleteUserById,
} from '../models';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json({
	    users: users
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

export const getSingleUser = async (req: Request, res: Response) => {
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

    const user = await getUserById(id);

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

export const updateSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password, type } = req.body;

    const user = await getUserByIdWithPassword(id);

    if (!user) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'User not found',
      });
    }

    let hashed_password = password;

    if (password) {
      hashed_password = await encryptPassword(password);
    }

    const updated_user = await updateUserById(
      id,
      username ?? user.username,
      email ?? user.email,
      hashed_password ?? user.password,
      type ?? user.type,
    );

    return res.status(200).json({
      data: updated_user,
      success: true,
      message: 'Operation completed successfully',
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

export const deleteSingleUser = async (req: Request, res: Response) => {
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

    const user = await getUserById(id);

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

    await deleteUserById(id);

    return res.status(200).json({
      data: null,
      success: true,
      message: 'Operation completed successfully',
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
