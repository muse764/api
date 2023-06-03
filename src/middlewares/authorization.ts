import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { merge, get } from 'lodash';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const isAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
