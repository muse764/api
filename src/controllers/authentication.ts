import crypto from 'crypto';
import { Request, Response } from 'express';

import {
  comparePassword,
  encryptPassword,
  generateAccessToken,
  generateRefreshToken,
} from '../helpers';
import { createUserModel, getUserByEmailModel } from '../models';

export const register = async (req: Request, res: Response) => {
  try {
    const { full_name, username, email, password } = req.body;

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
      hashed_password
    );

    return res.status(201).json({
      new_user,
    });
  } catch (error) {
    const status = 500;
    const message = `Internal server error`;
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      const status = 400;
      const message = `Email is missing`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (!password) {
      const status = 400;
      const message = `Password is missing`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    const user = await getUserByEmailModel(email);

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

    const match = await comparePassword(password, user.password);

    if (!match) {
      const status = 400;
      const message = `Wrong password`;
      return res.status(status).json({
        error: {
          status,
          message,
        },
      });
    }

    if (user.active === false) {
      const status = 400;
      const message = 'User is not active';
      return res.status(400).json({
        error: {
          status,
          message,
        },
      });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'lax',
    //   domain: 'muse.com',
    //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    // });

    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'lax',
    //   domain: 'muse.com',
    //   expires: new Date(Date.now() + 1000 * 60 * 60),
    // });

    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    const status = 500;
    const message = `Internal server error`;
    return res.status(status).json({
      error: {
        status,
        message,
      },
    });
  }
};
