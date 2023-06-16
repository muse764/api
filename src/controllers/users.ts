import { Request, Response } from 'express';

import crypto from 'crypto';
import fs from 'fs';
import { encryptPassword } from '../helpers';
import {
  createUserModel,
  deleteUserByIdModel,
  getUserByEmailModel,
  getUserByIdModel,
  getUsersModel,
  updateUserByIdModel,
} from '../models';

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { full_name, username, email, password, role } = req.body;

    if (!username || !email || !password) {
      const status = 400;
      const message = `Please provide all required fields`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (!full_name) {
      const status = 400;
      const message = `Please provide your full name`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (!username) {
      const status = 400;
      const message = `Please provide your username`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    // if email is not provided
    if (!email) {
      const status = 400;
      const message = `Please provide your email`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (!password) {
      const status = 400;
      const message = `Please provide your password`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (full_name.length < 3) {
      const status = 400;
      const message = `Full name must be at least 3 characters long`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (username.length < 6) {
      const status = 400;
      const message = `Username must be at least 6 characters long`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (username.includes(' ')) {
      const status = 400;
      const message = `Username must not contain spaces`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (!email.includes('@')) {
      const status = 400;
      const message = `Please provide a valid email`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (password.length < 8) {
      const status = 400;
      const message = `Password must be at least 8 characters long`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    // if password includes spaces
    if (password.includes(' ')) {
      const status = 400;
      const message = `Password must not contain spaces`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    // if password includes at least one number
    if (!/\d/.test(password)) {
      const status = 400;
      const message = `Password must include at least one number`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    // if password includes at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      const status = 400;
      const message = `Password must include at least one uppercase letter`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    // if password includes at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      const status = 400;
      const message = `Password must include at least one lowercase letter`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    // if password includes at least one special character
    if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
      const status = 400;
      const message = `Password must include at least one special character`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    const user = await getUserByEmailModel(email);

    if (user) {
      const status = 400;
      const message = `User with email ${email} already exists`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    const hashed_password = await encryptPassword(password);
    const id = crypto.randomBytes(22).toString('hex');

    const new_user = await createUserModel(
      id,
      full_name,
      username,
      email,
      hashed_password,
      role
    );

    const FOLDER = `public/users/${id}`;

    if (!fs.existsSync(FOLDER)) {
      fs.mkdirSync(FOLDER, { recursive: true });
    }

    return res.status(201).json({
      new_user,
    });
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

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getUsersModel();
    res.status(200).json({
      users,
    });
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

export const updateSingleUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { full_name, username, email, password, role } = req.body;

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
      full_name ?? user.full_name,
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

export const deleteSingleUserController = async (
  req: Request,
  res: Response
) => {
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
