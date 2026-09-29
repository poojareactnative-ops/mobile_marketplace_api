"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerService = void 0;
const prisma_1 = require("../config/prisma");
const apiError_1 = require("../utils/apiError");
class SellerService {
    static async getDashboardSummary(shopId, period = '30d') {
        const shop = await prisma_1.prisma.shop.findUnique({
            where: { id: shopId },
        });
        if (!shop) {
            throw apiError_1.ApiError.notFound('Shop not found');
        }
        const totalProducts = await prisma_1.prisma.product.count({
            where: { shopId },
        });
        const lowStockCount = await prisma_1.prisma.product.count({
            where: {
                shopId,
                stock: { lte: 5 },
            },
        });
        const totalEnquiries = await prisma_1.prisma.whatsAppEnquiry.count({
            where: { shopId },
        });
        const recentEnquiries = await prisma_1.prisma.whatsAppEnquiry.findMany({
            where: { shopId },
            take: 5,
            include: {
                product: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        // Repair Job breakdown by status
        const repairStatusCounts = await prisma_1.prisma.repairJob.groupBy({
            by: ['status'],
            where: { shopId },
            _count: { status: true },
        });
        const repairSummary = {};
        repairStatusCounts.forEach((item) => {
            repairSummary[item.status] = item._count.status;
        });
        const totalRepairJobs = await prisma_1.prisma.repairJob.count({ where: { shopId } });
        return {
            shop: {
                id: shop.id,
                name: shop.name,
                isVerified: shop.isVerified,
                isActive: shop.isActive,
            },
            kpi: {
                totalProducts,
                lowStockCount,
                totalEnquiries,
                totalRepairJobs,
            },
            repairSummary,
            recentEnquiries,
        };
    }
    static async getProducts(shopId, query) {
        const { page, limit, search, status, categoryId, minPrice, maxPrice, sort } = query;
        const where = { shopId };
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { brand: { contains: search } },
                { sku: { contains: search } },
            ];
        }
        if (status) {
            where.status = status;
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.pricePaise = {};
            if (minPrice !== undefined)
                where.pricePaise.gte = minPrice;
            if (maxPrice !== undefined)
                where.pricePaise.lte = maxPrice;
        }
        let orderBy = { createdAt: 'desc' };
        if (sort === 'price_asc')
            orderBy = { pricePaise: 'asc' };
        if (sort === 'price_desc')
            orderBy = { pricePaise: 'desc' };
        const total = await prisma_1.prisma.product.count({ where });
        const products = await prisma_1.prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                images: { orderBy: { position: 'asc' } },
                category: true,
            },
            orderBy,
        });
        return { data: products, meta: { page, limit, total } };
    }
    static async createProduct(shopId, input) {
        const category = await prisma_1.prisma.category.findUnique({
            where: { id: input.categoryId },
        });
        if (!category) {
            throw apiError_1.ApiError.notFound('Category not found');
        }
        const { images, ...productData } = input;
        const product = await prisma_1.prisma.product.create({
            data: {
                ...productData,
                shopId,
                images: images && images.length > 0
                    ? {
                        create: images.map((img, idx) => ({
                            url: img.url,
                            altText: img.altText || productData.name,
                            position: img.position ?? idx,
                        })),
                    }
                    : undefined,
            },
            include: {
                images: true,
                category: true,
            },
        });
        return product;
    }
    static async getProductById(shopId, productId) {
        const product = await prisma_1.prisma.product.findFirst({
            where: { id: productId, shopId },
            include: {
                images: { orderBy: { position: 'asc' } },
                category: true,
            },
        });
        if (!product) {
            throw apiError_1.ApiError.notFound('Product not found in your shop');
        }
        return product;
    }
    static async updateProduct(shopId, productId, input) {
        const existing = await prisma_1.prisma.product.findFirst({
            where: { id: productId, shopId },
        });
        if (!existing) {
            throw apiError_1.ApiError.notFound('Product not found in your shop');
        }
        const { images, ...productData } = input;
        if (images !== undefined) {
            // Delete old images and recreate
            await prisma_1.prisma.productImage.deleteMany({ where: { productId } });
        }
        const updated = await prisma_1.prisma.product.update({
            where: { id: productId },
            data: {
                ...productData,
                images: images && images.length > 0
                    ? {
                        create: images.map((img, idx) => ({
                            url: img.url,
                            altText: img.altText || existing.name,
                            position: img.position ?? idx,
                        })),
                    }
                    : undefined,
            },
            include: {
                images: true,
                category: true,
            },
        });
        return updated;
    }
    static async deleteProduct(shopId, productId) {
        const existing = await prisma_1.prisma.product.findFirst({
            where: { id: productId, shopId },
        });
        if (!existing) {
            throw apiError_1.ApiError.notFound('Product not found in your shop');
        }
        await prisma_1.prisma.product.delete({ where: { id: productId } });
        return { success: true, message: 'Product deleted successfully' };
    }
    static async getEnquiries(shopId, page = 1, limit = 20) {
        const total = await prisma_1.prisma.whatsAppEnquiry.count({ where: { shopId } });
        const enquiries = await prisma_1.prisma.whatsAppEnquiry.findMany({
            where: { shopId },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                product: {
                    select: { id: true, name: true, pricePaise: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { data: enquiries, meta: { page, limit, total } };
    }
    static async getShopProfile(shopId) {
        const shop = await prisma_1.prisma.shop.findUnique({
            where: { id: shopId },
            include: {
                ownerUser: { select: { id: true, name: true, email: true, phone: true } },
            },
        });
        if (!shop) {
            throw apiError_1.ApiError.notFound('Shop profile not found');
        }
        return shop;
    }
    static async updateShopProfile(shopId, input) {
        const shop = await prisma_1.prisma.shop.findUnique({ where: { id: shopId } });
        if (!shop) {
            throw apiError_1.ApiError.notFound('Shop not found');
        }
        const updated = await prisma_1.prisma.shop.update({
            where: { id: shopId },
            data: input,
        });
        return updated;
    }
}
exports.SellerService = SellerService;
