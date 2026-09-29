"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemService = void 0;
const prisma_1 = require("../config/prisma");
const apiError_1 = require("../utils/apiError");
const enums_1 = require("../types/enums");
class SystemService {
    static async getVisitorAnalytics(period = '30d') {
        const now = new Date();
        let startDate = new Date();
        if (period === '24h') {
            startDate.setHours(now.getHours() - 24);
        }
        else if (period === '7d') {
            startDate.setDate(now.getDate() - 7);
        }
        else if (period === '90d') {
            startDate.setDate(now.getDate() - 90);
        }
        else if (period === 'all') {
            startDate = new Date(0);
        }
        else {
            startDate.setDate(now.getDate() - 30);
        }
        const analyticsRecords = await prisma_1.prisma.visitorAnalytics.findMany({
            where: {
                timestamp: {
                    gte: startDate,
                },
            },
            include: {
                shop: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { timestamp: 'asc' },
        });
        const totalPageViews = analyticsRecords.filter((r) => r.actionType === 'PAGE_VIEW').length;
        const nearbySearches = analyticsRecords.filter((r) => r.actionType === 'NEARBY_SEARCH').length;
        const whatsAppEnquiriesTriggered = analyticsRecords.filter((r) => r.actionType === 'WHATSAPP_ENQUIRY_CLICK').length;
        const uniqueVisitorSet = new Set(analyticsRecords.map((r) => r.visitorId || r.ipHash));
        const uniqueVisitors = uniqueVisitorSet.size;
        const activeSuperSellers = await prisma_1.prisma.user.count({
            where: {
                role: enums_1.UserRole.SUPER_SELLER,
                status: enums_1.UserStatus.APPROVED,
            },
        });
        const pendingSellerApplications = await prisma_1.prisma.superSellerApplication.count({
            where: {
                status: enums_1.ApplicationStatus.PENDING,
            },
        });
        const dailyMap = new Map();
        analyticsRecords.forEach((r) => {
            const dateStr = r.timestamp.toISOString().split('T')[0];
            if (!dailyMap.has(dateStr)) {
                dailyMap.set(dateStr, {
                    pageViews: 0,
                    uniqueVisitorsSet: new Set(),
                    whatsAppEnquiries: 0,
                });
            }
            const entry = dailyMap.get(dateStr);
            if (r.actionType === 'PAGE_VIEW') {
                entry.pageViews++;
            }
            if (r.actionType === 'WHATSAPP_ENQUIRY_CLICK') {
                entry.whatsAppEnquiries++;
            }
            entry.uniqueVisitorsSet.add(r.visitorId || r.ipHash);
        });
        const dailyTrafficSeries = Array.from(dailyMap.entries()).map(([date, data]) => ({
            date,
            pageViews: data.pageViews,
            uniqueVisitors: data.uniqueVisitorsSet.size,
            whatsAppEnquiries: data.whatsAppEnquiries,
        }));
        const shopMap = new Map();
        analyticsRecords.forEach((r) => {
            if (r.shopId && r.shop) {
                if (!shopMap.has(r.shopId)) {
                    shopMap.set(r.shopId, {
                        shopId: r.shopId,
                        shopName: r.shop.name,
                        views: 0,
                        whatsAppClicks: 0,
                    });
                }
                const item = shopMap.get(r.shopId);
                if (r.actionType === 'PAGE_VIEW')
                    item.views++;
                if (r.actionType === 'WHATSAPP_ENQUIRY_CLICK')
                    item.whatsAppClicks++;
            }
        });
        const topVisitedShops = Array.from(shopMap.values())
            .sort((a, b) => b.views + b.whatsAppClicks - (a.views + a.whatsAppClicks))
            .slice(0, 10);
        return {
            summary: {
                totalPageViews,
                uniqueVisitors,
                nearbySearches,
                whatsAppEnquiriesTriggered,
                activeSuperSellers,
                pendingSellerApplications,
            },
            dailyTrafficSeries,
            topVisitedShops,
        };
    }
    static async getSellerApplications(status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        return prisma_1.prisma.superSellerApplication.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        status: true,
                        role: true,
                        createdAt: true,
                    },
                },
                reviewedByUser: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getSellerApplicationById(id) {
        const application = await prisma_1.prisma.superSellerApplication.findUnique({
            where: { id },
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
        });
        if (!application) {
            throw apiError_1.ApiError.notFound('Super Seller application not found');
        }
        return application;
    }
    static async approveSellerApplication(id, systemUserId) {
        const application = await prisma_1.prisma.superSellerApplication.findUnique({
            where: { id },
            include: { user: { include: { shops: true } } },
        });
        if (!application) {
            throw apiError_1.ApiError.notFound('Application not found');
        }
        if (application.status === enums_1.ApplicationStatus.APPROVED) {
            throw apiError_1.ApiError.conflict('Application is already approved');
        }
        const updatedResult = await prisma_1.prisma.$transaction(async (tx) => {
            const updatedApp = await tx.superSellerApplication.update({
                where: { id },
                data: {
                    status: enums_1.ApplicationStatus.APPROVED,
                    reviewedBySystemUserId: systemUserId,
                    reviewedAt: new Date(),
                },
            });
            const updatedUser = await tx.user.update({
                where: { id: application.userId },
                data: {
                    status: enums_1.UserStatus.APPROVED,
                },
            });
            const primaryShop = application.user.shops[0];
            let updatedShop = null;
            if (primaryShop) {
                updatedShop = await tx.shop.update({
                    where: { id: primaryShop.id },
                    data: {
                        isVerified: true,
                        isActive: true,
                    },
                });
            }
            return { updatedApp, updatedUser, updatedShop };
        });
        return {
            applicationId: updatedResult.updatedApp.id,
            status: updatedResult.updatedApp.status,
            approvedAt: updatedResult.updatedApp.reviewedAt,
            user: {
                id: updatedResult.updatedUser.id,
                email: updatedResult.updatedUser.email,
                status: updatedResult.updatedUser.status,
                role: updatedResult.updatedUser.role,
            },
            shop: updatedResult.updatedShop
                ? {
                    id: updatedResult.updatedShop.id,
                    name: updatedResult.updatedShop.name,
                    isVerified: updatedResult.updatedShop.isVerified,
                    isActive: updatedResult.updatedShop.isActive,
                }
                : null,
            message: 'Super Seller account successfully approved and activated.',
        };
    }
    static async rejectSellerApplication(id, systemUserId, rejectionReason) {
        const application = await prisma_1.prisma.superSellerApplication.findUnique({
            where: { id },
        });
        if (!application) {
            throw apiError_1.ApiError.notFound('Application not found');
        }
        const updatedResult = await prisma_1.prisma.$transaction(async (tx) => {
            const updatedApp = await tx.superSellerApplication.update({
                where: { id },
                data: {
                    status: enums_1.ApplicationStatus.REJECTED,
                    rejectionReason,
                    reviewedBySystemUserId: systemUserId,
                    reviewedAt: new Date(),
                },
            });
            const updatedUser = await tx.user.update({
                where: { id: application.userId },
                data: {
                    status: enums_1.UserStatus.REJECTED,
                },
            });
            return { updatedApp, updatedUser };
        });
        return {
            applicationId: updatedResult.updatedApp.id,
            status: updatedResult.updatedApp.status,
            rejectionReason: updatedResult.updatedApp.rejectionReason,
            user: {
                id: updatedResult.updatedUser.id,
                email: updatedResult.updatedUser.email,
                status: updatedResult.updatedUser.status,
            },
            message: 'Super Seller application rejected.',
        };
    }
    static async getAllShops(page = 1, limit = 20, search) {
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { phone: { contains: search } },
                { address: { contains: search } },
            ];
        }
        const total = await prisma_1.prisma.shop.count({ where });
        const shops = await prisma_1.prisma.shop.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                ownerUser: {
                    select: { id: true, name: true, email: true, status: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { data: shops, meta: { page, limit, total } };
    }
    static async updateShopStatus(shopId, isActive, isVerified) {
        const shop = await prisma_1.prisma.shop.findUnique({ where: { id: shopId } });
        if (!shop) {
            throw apiError_1.ApiError.notFound('Shop not found');
        }
        const updatedShop = await prisma_1.prisma.shop.update({
            where: { id: shopId },
            data: {
                ...(typeof isActive === 'boolean' ? { isActive } : {}),
                ...(typeof isVerified === 'boolean' ? { isVerified } : {}),
            },
        });
        return updatedShop;
    }
    static async getLandingPageSections() {
        return prisma_1.prisma.landingPageSection.findMany({
            orderBy: { sortOrder: 'asc' },
        });
    }
    static async updateLandingPageSection(key, data) {
        const section = await prisma_1.prisma.landingPageSection.findUnique({ where: { key } });
        if (!section) {
            return prisma_1.prisma.landingPageSection.create({
                data: { key, ...data },
            });
        }
        return prisma_1.prisma.landingPageSection.update({
            where: { key },
            data,
        });
    }
}
exports.SystemService = SystemService;
