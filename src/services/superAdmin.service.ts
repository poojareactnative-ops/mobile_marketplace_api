import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { ApplicationStatus, UserStatus, UserRole, PlanTier, BillingStatus } from '../types/enums';
import {
  ListRequestsQuery,
  ApproveRequestInput,
  RejectRequestInput,
  CreatePlanInput,
} from '../schemas/superAdmin.schema';
import { PlanStore } from '../utils/planStore';
import { SystemService } from './system.service';

export class SuperAdminService {
  static async listRequests(query: ListRequestsQuery) {
    const { status, page = 1, limit = 20 } = query;
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [total, applications, totalPending, totalApproved] = await Promise.all([
      prisma.superSellerApplication.count({ where }),
      prisma.superSellerApplication.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            include: {
              shops: true,
            },
          },
          reviewedByUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.superSellerApplication.count({ where: { status: ApplicationStatus.PENDING } }),
      prisma.superSellerApplication.count({ where: { status: ApplicationStatus.APPROVED } }),
    ]);

    const data = applications.map((app) => {
      const primaryShop = app.user?.shops?.[0];
      return {
        requestId: app.id,
        status: app.status,
        createdAt: app.createdAt,
        shop: primaryShop
          ? {
              id: primaryShop.id,
              name: primaryShop.name,
              type: primaryShop.type,
              address: primaryShop.address,
              latitude: primaryShop.latitude,
              longitude: primaryShop.longitude,
            }
          : {
              id: '',
              name: app.shopName,
              type: app.shopType,
              address: app.address,
              latitude: 12.9716,
              longitude: 77.5946,
            },
        applicant: {
          userId: app.user?.id || app.userId,
          name: app.user?.name || '',
          email: app.user?.email || '',
          phone: app.user?.phone || app.phone,
        },
        membership: {
          planTier: PlanTier.STARTER,
          feePaise: 99900,
          billingStatus: BillingStatus.MANUALLY_VERIFIED,
        },
        rejectionReason: app.rejectionReason,
      };
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPending,
        totalApproved,
      },
    };
  }

  static async approveRequest(requestId: string, adminId: string, input: ApproveRequestInput) {
    const application = await prisma.superSellerApplication.findUnique({
      where: { id: requestId },
      include: { user: { include: { shops: true } } },
    });

    if (!application) {
      throw ApiError.notFound('Super Seller request not found');
    }

    if (application.status === ApplicationStatus.APPROVED) {
      throw ApiError.conflict('Request has already been approved');
    }

    const grantVerificationBadge = input.grantVerificationBadge !== false;

    const result = await prisma.$transaction(async (tx) => {
      const updatedApp = await tx.superSellerApplication.update({
        where: { id: requestId },
        data: {
          status: ApplicationStatus.APPROVED,
          reviewedBySystemUserId: adminId,
          reviewedAt: new Date(),
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: application.userId },
        data: {
          status: UserStatus.ACTIVE,
        },
      });

      let updatedShop = null;
      const primaryShop = application.user.shops[0];
      if (primaryShop) {
        updatedShop = await tx.shop.update({
          where: { id: primaryShop.id },
          data: {
            isActive: true,
            isVerified: grantVerificationBadge,
          },
        });
      }

      return { updatedApp, updatedUser, updatedShop };
    });

    return {
      message: 'Super Seller request approved. Shop is now activated and live for nearby clients.',
      requestId: result.updatedApp.id,
      status: 'APPROVED',
      shopId: result.updatedShop?.id || '',
      isVerified: result.updatedShop?.isVerified ?? true,
      isActive: result.updatedShop?.isActive ?? true,
      planTier: input.planTier || PlanTier.STANDARD_FREE,
      billingStatus: input.billingStatus || BillingStatus.FREE_TIER,
    };
  }

  static async rejectRequest(requestId: string, adminId: string, input: RejectRequestInput) {
    const application = await prisma.superSellerApplication.findUnique({
      where: { id: requestId },
    });

    if (!application) {
      throw ApiError.notFound('Super Seller request not found');
    }

    await prisma.$transaction(async (tx) => {
      await tx.superSellerApplication.update({
        where: { id: requestId },
        data: {
          status: ApplicationStatus.REJECTED,
          rejectionReason: input.rejectionReason,
          reviewedBySystemUserId: adminId,
          reviewedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: application.userId },
        data: {
          status: UserStatus.REJECTED,
        },
      });
    });

    return {
      requestId,
      status: 'REJECTED',
      rejectionReason: input.rejectionReason,
      message: 'Super Seller request rejected.',
    };
  }

  static async createPlan(input: CreatePlanInput) {
    return PlanStore.create(input);
  }

  static async listPlans() {
    return PlanStore.getAll();
  }

  static async getAnalytics(period: string = '30d') {
    return SystemService.getVisitorAnalytics(period);
  }
}
