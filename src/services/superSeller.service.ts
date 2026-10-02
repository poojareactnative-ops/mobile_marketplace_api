import { prisma } from '../config/prisma';
import { hashPassword } from '../utils/hash';
import { ApiError } from '../utils/apiError';
import { UserRole, UserStatus } from '../types/enums';
import { CreateSellerAdminInput, UpdateSellerAdminStatusInput } from '../schemas/superSeller.schema';
import { ShopAdminStore } from '../utils/shopAdminStore';

export class SuperSellerService {
  static async createAdmin(shopId: string, superSellerUserId: string, input: CreateSellerAdminInput) {
    // 1. Verify shop belongs to super seller or super seller is owner
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw ApiError.notFound('Shop not found');
    }

    if (shop.ownerUserId !== superSellerUserId) {
      throw ApiError.forbidden('You can only create admins for your own shop');
    }

    // 2. Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw ApiError.conflict('User with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);

    // 3. Create Admin user
    const adminUser = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash,
        role: UserRole.SELLER_ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    // 4. Store shop link
    ShopAdminStore.associateAdmin(adminUser.id, shopId, superSellerUserId);

    return {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      phone: adminUser.phone,
      role: adminUser.role,
      shopId,
      status: adminUser.status,
      createdAt: adminUser.createdAt,
    };
  }

  static async listAdmins(shopId: string, superSellerUserId: string) {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      throw ApiError.notFound('Shop not found');
    }

    if (shop.ownerUserId !== superSellerUserId) {
      throw ApiError.forbidden('You can only view admins for your own shop');
    }

    const adminIds = ShopAdminStore.getAdminsForShop(shopId);

    if (adminIds.length === 0) {
      return [];
    }

    const admins = await prisma.user.findMany({
      where: { id: { in: adminIds } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return admins.map((a) => ({
      ...a,
      shopId,
    }));
  }

  static async updateAdminStatus(
    shopId: string,
    superSellerUserId: string,
    adminId: string,
    input: UpdateSellerAdminStatusInput
  ) {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop || shop.ownerUserId !== superSellerUserId) {
      throw ApiError.forbidden('Unauthorized access to shop admins');
    }

    const linkedShopId = ShopAdminStore.getShopIdForAdmin(adminId);
    if (linkedShopId !== shopId) {
      throw ApiError.notFound('Admin does not belong to your shop');
    }

    const updatedUser = await prisma.user.update({
      where: { id: adminId },
      data: { status: input.status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedUser,
      shopId,
      message: `Admin status successfully updated to ${input.status}`,
    };
  }

  static async deleteAdmin(shopId: string, superSellerUserId: string, adminId: string) {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop || shop.ownerUserId !== superSellerUserId) {
      throw ApiError.forbidden('Unauthorized access to shop admins');
    }

    const linkedShopId = ShopAdminStore.getShopIdForAdmin(adminId);
    if (linkedShopId !== shopId) {
      throw ApiError.notFound('Admin does not belong to your shop');
    }

    ShopAdminStore.removeAdmin(adminId);

    await prisma.user.update({
      where: { id: adminId },
      data: { status: UserStatus.SUSPENDED },
    });

    return {
      success: true,
      message: 'Admin account removed from shop successfully.',
    };
  }
}
