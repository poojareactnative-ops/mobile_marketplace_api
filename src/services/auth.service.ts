import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from '../utils/jwt';
import { ApiError } from '../utils/apiError';
import {
  RegisterSellerInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../schemas/auth.schema';
import { UserRole, UserStatus, ApplicationStatus } from '../types/enums';
import { ShopAdminStore } from '../utils/shopAdminStore';

export class AuthService {
  static async registerSeller(input: RegisterSellerInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);

    // Create User, Shop, and SuperSellerApplication in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          passwordHash,
          role: UserRole.SUPER_SELLER,
          status: UserStatus.PENDING_APPROVAL,
        },
      });

      const shop = await tx.shop.create({
        data: {
          ownerUserId: user.id,
          name: input.shopName,
          type: input.shopType,
          address: input.address,
          phone: input.phone,
          whatsappNumber: input.whatsappNumber || input.phone,
          latitude: input.latitude,
          longitude: input.longitude,
          isActive: false,
          isVerified: false,
          openingHours: input.openingHours || 'Mon-Sat: 09:00 AM - 09:00 PM',
        },
      });

      const application = await tx.superSellerApplication.create({
        data: {
          userId: user.id,
          shopName: input.shopName,
          shopType: input.shopType,
          phone: input.phone,
          address: input.address,
          businessDocUrl: input.businessDocUrl,
          status: ApplicationStatus.PENDING,
        },
      });

      return { user, shop, application };
    });

    return {
      message: 'Registration submitted successfully. Account pending Super Admin approval.',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role as UserRole,
        status: result.user.status as UserStatus,
      },
      shop: {
        id: result.shop.id,
        name: result.shop.name,
        isVerified: result.shop.isVerified,
        isActive: result.shop.isActive,
      },
      application: {
        id: result.application.id,
        status: result.application.status as ApplicationStatus,
      },
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        shops: true,
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isValidPassword = await comparePassword(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.status === UserStatus.PENDING_APPROVAL) {
      throw ApiError.forbidden(
        'Your Super Seller account registration is pending approval by Super Admin. Please wait for platform review.'
      );
    }

    if (user.status === UserStatus.REJECTED) {
      const latestApp = user.applications[0];
      const reason = latestApp?.rejectionReason ? `: ${latestApp.rejectionReason}` : '.';
      throw ApiError.forbidden(`Your Super Seller application was rejected${reason}`);
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw ApiError.forbidden('Your account has been suspended. Please contact platform administration.');
    }

    let primaryShop = user.shops[0];
    if (!primaryShop) {
      const adminShopId = ShopAdminStore.getShopIdForAdmin(user.id);
      if (adminShopId) {
        primaryShop = (await prisma.shop.findUnique({ where: { id: adminShopId } })) as any;
      }
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      status: user.status as UserStatus,
      shopId: primaryShop?.id,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      shop: primaryShop
        ? {
            id: primaryShop.id,
            name: primaryShop.name,
            type: primaryShop.type,
            isVerified: primaryShop.isVerified,
            isActive: primaryShop.isActive,
          }
        : null,
    };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { shops: true },
      });

      if (!user || user.status === UserStatus.SUSPENDED || user.status === UserStatus.REJECTED) {
        throw ApiError.unauthorized('User is no longer active');
      }

      let primaryShop = user.shops[0];
      if (!primaryShop) {
        const adminShopId = ShopAdminStore.getShopIdForAdmin(user.id);
        if (adminShopId) {
          primaryShop = (await prisma.shop.findUnique({ where: { id: adminShopId } })) as any;
        }
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as UserRole,
        status: user.status as UserStatus,
        shopId: primaryShop?.id,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        shops: true,
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    let primaryShop = user.shops[0];
    if (!primaryShop) {
      const adminShopId = ShopAdminStore.getShopIdForAdmin(user.id);
      if (adminShopId) {
        primaryShop = (await prisma.shop.findUnique({ where: { id: adminShopId } })) as any;
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      shop: primaryShop || null,
      latestApplication: user.applications[0] || null,
    };
  }

  static async forgotPassword(input: ForgotPasswordInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return {
        message: 'If this email is registered, a password reset token has been generated.',
        resetToken: null,
      };
    }

    const resetToken = generatePasswordResetToken({
      userId: user.id,
      email: user.email,
    });

    return {
      message: 'Password reset token generated successfully. Valid for 15 minutes.',
      resetToken,
    };
  }

  static async resetPassword(input: ResetPasswordInput) {
    let payload;
    try {
      payload = verifyPasswordResetToken(input.token);
    } catch (_err: any) {
      throw ApiError.badRequest('Invalid or expired password reset token');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.email !== payload.email) {
      throw ApiError.notFound('User not found or token mismatch');
    }

    const passwordHash = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return {
      message: 'Password has been successfully reset. You can now log in with your new password.',
    };
  }
}


