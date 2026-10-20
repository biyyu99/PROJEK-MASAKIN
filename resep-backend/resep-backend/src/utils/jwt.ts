import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export function signToken(userId: number): string {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}
