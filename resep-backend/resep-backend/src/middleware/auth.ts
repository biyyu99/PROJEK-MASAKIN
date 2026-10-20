import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError(401, 'Token tidak ditemukan. Silakan login terlebih dahulu'));
  }

  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET) as JwtPayload & { id: number };
    req.user = { id: payload.id };
    next();
  } catch {
    next(new AppError(401, 'Token tidak valid atau sudah kedaluwarsa'));
  }
};
