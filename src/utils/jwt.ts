import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole, UserStatus } from '../types/enums';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  shopId?: string;
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

export interface PasswordResetPayload {
  userId: string;
  email: string;
  type: 'PASSWORD_RESET';
}

export function generatePasswordResetToken(payload: { userId: string; email: string }): string {
  return jwt.sign({ ...payload, type: 'PASSWORD_RESET' }, env.JWT_SECRET, {
    expiresIn: '15m',
  });
}

export function verifyPasswordResetToken(token: string): PasswordResetPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as PasswordResetPayload;
  if (decoded.type !== 'PASSWORD_RESET') {
    throw new Error('Invalid token type');
  }
  return decoded;
}

