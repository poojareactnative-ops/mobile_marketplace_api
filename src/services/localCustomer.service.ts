import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { CreateLocalCustomerInput, LocalCustomerQueryInput } from '../schemas/localCustomer.schema';

export class LocalCustomerService {
  static async listCustomers(shopId: string, query: LocalCustomerQueryInput) {
    const { search, page = 1, limit = 20 } = query;

    const where: any = { shopId };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const total = await prisma.repairCustomer.count({ where });
    const customers = await prisma.repairCustomer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        jobs: {
          select: { id: true, status: true, problemDescription: true, createdAt: true },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: customers.map((c) => ({
        id: c.id,
        shopId: c.shopId,
        name: c.name,
        phone: c.phone,
        email: c.email,
        totalRepairsCount: c.jobs.length,
        recentJobs: c.jobs,
        createdAt: c.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  static async createCustomer(shopId: string, adminUserId: string, input: CreateLocalCustomerInput) {
    // Check if customer already exists for this shop by phone
    const existing = await prisma.repairCustomer.findFirst({
      where: {
        shopId,
        phone: input.phone,
      },
    });

    if (existing) {
      const updated = await prisma.repairCustomer.update({
        where: { id: existing.id },
        data: {
          name: input.name,
          email: input.email || existing.email,
        },
      });

      return {
        id: updated.id,
        shopId: updated.shopId,
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        address: input.address || null,
        notes: input.notes || null,
        message: 'Customer record updated successfully.',
      };
    }

    const customer = await prisma.repairCustomer.create({
      data: {
        shopId,
        name: input.name,
        phone: input.phone,
        email: input.email || null,
      },
    });

    return {
      id: customer.id,
      shopId: customer.shopId,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: input.address || null,
      notes: input.notes || null,
      message: 'Walk-in customer registered successfully.',
    };
  }
}
