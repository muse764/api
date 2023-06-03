import { Request, Response } from 'express';
import crypto from 'crypto';

import {
  createUser,
  getUserByEmail,
  getUserByEmailWithPassword,
} from '../models';

import {
  encryptPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from '../helpers';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        data: null,
        success: false,
        message: `Please provide all required fields`,
      });
    }

    const user = await getUserByEmail(email);

    if (user) {
      return res.status(400).json({
        data: null,
        success: false,
        message: `User with email ${email} already exists`,
      });
    }

    const hashed_password = await encryptPassword(password);
    const id = crypto.randomBytes(22).toString('hex');

    const new_user = await createUser(id, username, email, hashed_password, "user");

    return res.status(201).json({
      data: new_user,
      success: true,
      message: 'Operation completed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      success: false,
      message: 'Operation failed',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({
        data: null,
        success: false,
        message: 'Email is missing',
      });
    }

    if (!password) {
      res.status(400).json({
        data: null,
        success: false,
        message: 'Password is missing',
      });
    }

    const user = await getUserByEmailWithPassword(email);

    if (!user) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'User not found',
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'Wrong password',
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      data: {
        accessToken,
        refreshToken,
      },
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      success: false,
      message: 'Operation failed',
    });
  }
};
