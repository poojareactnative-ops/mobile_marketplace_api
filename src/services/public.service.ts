import { prisma } from '../config/prisma';
import { calculateDistanceMeters } from '../utils/distance';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { hashIpAddress } from '../utils/hash';
import { ApiError } from '../utils/apiError';
import { WhatsAppEnquiryInput, TrackVisitorInput } from '../schemas/enquiry.schema';
import { NearbyShopsQueryInput } from '../schemas/shop.schema';

export class PublicService {
  static async getLandingPage() {
    const sections = await prisma.landingPageSection.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      take: 6,
    });

    const featuredProducts = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        shop: {
          isActive: true,
          isVerified: true,
        },
      },
      take: 8,
      include: {
        images: true,
        category: true,
        shop: {
          select: { id: true, name: true, phone: true, isVerified: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalVerifiedShops = await prisma.shop.count({
      where: { isActive: true, isVerified: true },
    });

    return {
      hero: {
        title: 'Find & Enquire Nearby Mobile Repair & Accessories Shops',
        subtitle: 'Connect directly with verified local Super Sellers via WhatsApp. Fast, local, transparent.',
        ctaText: 'Explore Nearby Shops',
      },
      sections,
      categories,
      featuredProducts,
      stats: {
        verifiedShopsCount: totalVerifiedShops,
      },
    };
  }

  static async getNearbyShops(query: NearbyShopsQueryInput) {
    const { lat, lng, radiusMeters, search, type, page, limit } = query;

    // Fetch all active and System-User verified shops
    const whereCondition: any = {
      isActive: true,
      isVerified: true,
    };

    if (search) {
      whereCondition.OR = [
        { name: { contains: search } },
        { type: { contains: search } },
        { address: { contains: search } },
      ];
    }

    if (type) {
      whereCondition.type = type;
    }

    const allVerifiedShops = await prisma.shop.findMany({
      where: whereCondition,
      include: {
        products: {
          where: { status: 'ACTIVE' },
          take: 4,
          include: { images: true },
        },
      },
    });

    // Compute Haversine distance in meters and filter within radiusMeters
    const shopsWithDistance = allVerifiedShops
      .map((shop) => {
        const distanceMeters = calculateDistanceMeters(lat, lng, shop.latitude, shop.longitude);
        return {
          ...shop,
          distanceMeters,
          distanceKm: parseFloat((distanceMeters / 1000).toFixed(2)),
        };
      })
      .filter((shop) => shop.distanceMeters <= radiusMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    const total = shopsWithDistance.length;
    const startIndex = (page - 1) * limit;
    const paginatedShops = shopsWithDistance.slice(startIndex, startIndex + limit);

    return {
      data: paginatedShops,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  static async getFeaturedProducts(limit = 8) {
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        shop: {
          isActive: true,
          isVerified: true,
        },
      },
      take: limit,
      include: {
        images: true,
        category: true,
        shop: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsappNumber: true,
            address: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  static async getCategories(type = 'accessory') {
    return prisma.category.findMany({
      where: {
        isActive: true,
        type,
      },
      orderBy: { name: 'asc' },
    });
  }

  static async getShopById(shopId: string) {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        offers: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!shop || !shop.isActive || !shop.isVerified) {
      throw ApiError.notFound('Shop not found or not active');
    }

    return shop;
  }

  static async getShopProducts(shopId: string, page = 1, limit = 20, search?: string, categoryId?: string) {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop || !shop.isActive || !shop.isVerified) {
      throw ApiError.notFound('Shop not found');
    }

    const where: any = {
      shopId,
      status: 'ACTIVE',
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const total = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: products,
      meta: { page, limit, total },
    };
  }

  static async createWhatsAppEnquiry(input: WhatsAppEnquiryInput, ipAddress: string, userAgent?: string) {
    const shop = await prisma.shop.findUnique({
      where: { id: input.shopId },
    });

    if (!shop || !shop.isActive || !shop.isVerified) {
      throw ApiError.notFound('Shop not found or not active');
    }

    let product = null;
    if (input.productId) {
      product = await prisma.product.findUnique({
        where: { id: input.productId },
      });
    }

    const formatted = buildWhatsAppUrl(
      shop.whatsappNumber || shop.phone,
      shop.name,
      product?.name,
      product?.id,
      input.message
    );

    // Save Enquiry record
    const enquiry = await prisma.whatsAppEnquiry.create({
      data: {
        shopId: shop.id,
        productId: product?.id,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        message: input.message,
        whatsappUrl: formatted.whatsappUrl,
        ipAddress: hashIpAddress(ipAddress),
      },
    });

    // Track visitor action for analytics
    await prisma.visitorAnalytics.create({
      data: {
        visitorId: input.customerPhone,
        ipHash: hashIpAddress(ipAddress),
        userAgent: userAgent || 'WhatsAppEnquiryClient',
        pageUrl: `/shops/${shop.id}`,
        actionType: 'WHATSAPP_ENQUIRY_CLICK',
        shopId: shop.id,
      },
    });

    return {
      enquiryId: enquiry.id,
      whatsappNumber: formatted.whatsappNumber,
      whatsappUrl: formatted.whatsappUrl,
      status: 'REDIRECT_TO_WHATSAPP',
    };
  }

  static async trackVisitor(input: TrackVisitorInput, ipAddress: string) {
    const hashedIp = hashIpAddress(ipAddress);

    await prisma.visitorAnalytics.create({
      data: {
        visitorId: input.visitorId,
        ipHash: hashedIp,
        userAgent: input.userAgent || 'WebVisitor',
        pageUrl: input.pageUrl,
        actionType: input.actionType,
        shopId: input.shopId || null,
      },
    });

    return { success: true };
  }
}
