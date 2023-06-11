import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string, role: String) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '1h',
  });
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '30d',
  });
};
