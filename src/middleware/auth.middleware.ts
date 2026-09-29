import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import { ApiError } from '../utils/apiError';
import { UserRole, UserStatus } from '../types/enums';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing or invalid Authorization header'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
}

export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Role '${req.user.role}' is not authorized to access this resource`));
    }

    return next();
  };
}

export function requireApproved(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }

  if (req.user.role === UserRole.SUPER_SELLER && req.user.status !== UserStatus.APPROVED) {
    return next(
      ApiError.forbidden(
        req.user.status === UserStatus.PENDING_APPROVAL
          ? 'Your Super Seller registration is pending System User approval.'
          : 'Your account has been rejected or suspended.'
      )
    );
  }

  return next();
}
