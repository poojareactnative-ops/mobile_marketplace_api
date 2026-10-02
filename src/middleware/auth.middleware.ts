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

    const effectiveRole = req.user.role === UserRole.SYSTEM_USER ? UserRole.SUPER_ADMIN : req.user.role;
    const normalizedAllowed = allowedRoles.map((r) => (r === UserRole.SYSTEM_USER ? UserRole.SUPER_ADMIN : r));

    if (!normalizedAllowed.includes(effectiveRole)) {
      return next(ApiError.forbidden(`Role '${req.user.role}' is not authorized to access this resource`));
    }

    return next();
  };
}

export function requireApproved(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }

  const isApprovedOrActive = req.user.status === UserStatus.APPROVED || req.user.status === UserStatus.ACTIVE;

  if (req.user.role === UserRole.SUPER_SELLER && !isApprovedOrActive) {
    return next(
      ApiError.forbidden(
        req.user.status === UserStatus.PENDING_APPROVAL
          ? 'Your Super Seller registration is pending Super Admin approval.'
          : 'Your account has been rejected or suspended.'
      )
    );
  }

  return next();
}
