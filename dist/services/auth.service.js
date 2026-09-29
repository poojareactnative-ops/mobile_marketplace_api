"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../config/prisma");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const apiError_1 = require("../utils/apiError");
const enums_1 = require("../types/enums");
class AuthService {
    static async registerSeller(input) {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: input.email },
        });
        if (existingUser) {
            throw apiError_1.ApiError.conflict('User with this email already exists');
        }
        const passwordHash = await (0, hash_1.hashPassword)(input.password);
        // Create User, Shop, and SuperSellerApplication in a transaction
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    phone: input.phone,
                    passwordHash,
                    role: enums_1.UserRole.SUPER_SELLER,
                    status: enums_1.UserStatus.PENDING_APPROVAL,
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
                    status: enums_1.ApplicationStatus.PENDING,
                },
            });
            return { user, shop, application };
        });
        return {
            message: 'Registration submitted successfully. Account pending System User approval.',
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                status: result.user.status,
            },
            shop: {
                id: result.shop.id,
                name: result.shop.name,
                isVerified: result.shop.isVerified,
                isActive: result.shop.isActive,
            },
            application: {
                id: result.application.id,
                status: result.application.status,
            },
        };
    }
    static async login(input) {
        const user = await prisma_1.prisma.user.findUnique({
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
            throw apiError_1.ApiError.unauthorized('Invalid email or password');
        }
        const isValidPassword = await (0, hash_1.comparePassword)(input.password, user.passwordHash);
        if (!isValidPassword) {
            throw apiError_1.ApiError.unauthorized('Invalid email or password');
        }
        if (user.status === enums_1.UserStatus.PENDING_APPROVAL) {
            throw apiError_1.ApiError.forbidden('Your Super Seller account registration is pending approval by a System User. Please wait for platform review.');
        }
        if (user.status === enums_1.UserStatus.REJECTED) {
            const latestApp = user.applications[0];
            const reason = latestApp?.rejectionReason ? `: ${latestApp.rejectionReason}` : '.';
            throw apiError_1.ApiError.forbidden(`Your Super Seller application was rejected${reason}`);
        }
        if (user.status === enums_1.UserStatus.SUSPENDED) {
            throw apiError_1.ApiError.forbidden('Your account has been suspended. Please contact platform administration.');
        }
        const primaryShop = user.shops[0];
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            shopId: primaryShop?.id,
        };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
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
    static async refreshToken(refreshToken) {
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { shops: true },
            });
            if (!user || user.status === enums_1.UserStatus.SUSPENDED || user.status === enums_1.UserStatus.REJECTED) {
                throw apiError_1.ApiError.unauthorized('User is no longer active');
            }
            const primaryShop = user.shops[0];
            const tokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                shopId: primaryShop?.id,
            };
            const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
            const newRefreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
            return { accessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw apiError_1.ApiError.unauthorized('Invalid or expired refresh token');
        }
    }
    static async getMe(userId) {
        const user = await prisma_1.prisma.user.findUnique({
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
            throw apiError_1.ApiError.notFound('User not found');
        }
        const primaryShop = user.shops[0];
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
}
exports.AuthService = AuthService;
