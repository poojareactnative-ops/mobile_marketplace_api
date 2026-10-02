import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import {
  CreateRepairCustomerInput,
  CreateRepairJobInput,
  UpdateRepairJobInput,
  CreateRepairUpdateInput,
} from '../schemas/repair.schema';
import { RepairStatus } from '../types/enums';

export class RepairService {
  static async createCustomer(shopId: string, input: CreateRepairCustomerInput) {
    return prisma.repairCustomer.create({
      data: {
        shopId,
        name: input.name,
        phone: input.phone,
        email: input.email || null,
      },
    });
  }

  static async getCustomers(shopId: string, page = 1, limit = 20, search?: string) {
    const where: any = { shopId };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const total = await prisma.repairCustomer.count({ where });
    const customers = await prisma.repairCustomer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return { data: customers, meta: { page, limit, total } };
  }

  static async createRepairJob(shopId: string, authorUserId: string, input: CreateRepairJobInput) {
    const job = await prisma.$transaction(async (tx) => {
      let repairCustomerId = input.repairCustomerId;
      if (!repairCustomerId) {
        const existingCust = await tx.repairCustomer.findFirst({
          where: { shopId, phone: input.customerPhone },
        });

        if (existingCust) {
          repairCustomerId = existingCust.id;
        } else {
          const newCust = await tx.repairCustomer.create({
            data: {
              shopId,
              name: input.customerName,
              phone: input.customerPhone,
            },
          });
          repairCustomerId = newCust.id;
        }
      }

      const repairJob = await tx.repairJob.create({
        data: {
          shopId,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          repairCustomerId,
          deviceId: input.deviceId || `${input.brand || 'Device'} ${input.model || ''}`.trim() || 'Unknown Device',
          problemDescription: input.problemDescription,
          status: RepairStatus.SUBMITTED,
          estimatedCostPaise: input.estimatedCostPaise,
          isSellable: input.isSellable ?? false,
        },
      });

      await tx.repairUpdate.create({
        data: {
          repairJobId: repairJob.id,
          authorUserId,
          status: RepairStatus.SUBMITTED,
          note: 'Repair job submitted.',
          estimatedCostPaise: input.estimatedCostPaise,
        },
      });

      return repairJob;
    });

    return job;
  }

  static async getRepairJobs(shopId: string, page = 1, limit = 20, status?: RepairStatus, search?: string) {
    const where: any = { shopId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { deviceId: { contains: search } },
        { problemDescription: { contains: search } },
      ];
    }

    const total = await prisma.repairJob.count({ where });
    const jobs = await prisma.repairJob.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        repairCustomer: true,
        assignedToUser: { select: { id: true, name: true, email: true } },
        updates: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: jobs, meta: { page, limit, total } };
  }

  static async getRepairJobById(shopId: string, jobId: string) {
    const job = await prisma.repairJob.findFirst({
      where: { id: jobId, shopId },
      include: {
        repairCustomer: true,
        assignedToUser: { select: { id: true, name: true, email: true } },
        updates: {
          include: {
            authorUser: { select: { id: true, name: true, email: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!job) {
      throw ApiError.notFound('Repair job not found');
    }

    return job;
  }

  static async updateRepairJob(
    shopId: string,
    jobId: string,
    authorUserId: string,
    input: UpdateRepairJobInput
  ) {
    const existing = await prisma.repairJob.findFirst({
      where: { id: jobId, shopId },
    });

    if (!existing) {
      throw ApiError.notFound('Repair job not found');
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      const job = await tx.repairJob.update({
        where: { id: jobId },
        data: input,
      });

      if (input.status || input.estimatedCostPaise !== undefined) {
        await tx.repairUpdate.create({
          data: {
            repairJobId: jobId,
            authorUserId,
            status: input.status || existing.status,
            note: `Status updated to ${input.status || existing.status}`,
            estimatedCostPaise: input.estimatedCostPaise ?? existing.estimatedCostPaise ?? undefined,
          },
        });
      }

      return job;
    });

    return updatedJob;
  }

  static async addRepairUpdate(
    shopId: string,
    jobId: string,
    authorUserId: string,
    input: CreateRepairUpdateInput
  ) {
    const job = await prisma.repairJob.findFirst({
      where: { id: jobId, shopId },
    });

    if (!job) {
      throw ApiError.notFound('Repair job not found');
    }

    const result = await prisma.$transaction(async (tx) => {
      const update = await tx.repairUpdate.create({
        data: {
          repairJobId: jobId,
          authorUserId,
          status: input.status,
          note: input.note,
          estimatedCostPaise: input.estimatedCostPaise,
        },
      });

      const isValidEnum = Object.values(RepairStatus).includes(input.status as RepairStatus);
      if (isValidEnum) {
        await tx.repairJob.update({
          where: { id: jobId },
          data: {
            status: input.status,
            estimatedCostPaise: input.estimatedCostPaise ?? undefined,
          },
        });
      }

      return update;
    });

    return result;
  }

  static async bookRepairGuest(input: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    brand: string;
    model: string;
    problemDescription: string;
    preferredShopId?: string;
  }) {
    let targetShopId = input.preferredShopId;

    if (!targetShopId) {
      const firstActiveShop = await prisma.shop.findFirst({
        where: { isActive: true, isVerified: true },
      });
      if (!firstActiveShop) {
        throw ApiError.badRequest('No active repair shop found for booking');
      }
      targetShopId = firstActiveShop.id;
    }

    const deviceId = `${input.brand} ${input.model}`.trim();

    const job = await prisma.$transaction(async (tx) => {
      let cust = await tx.repairCustomer.findFirst({
        where: { shopId: targetShopId!, phone: input.customerPhone },
      });

      if (!cust) {
        cust = await tx.repairCustomer.create({
          data: {
            shopId: targetShopId!,
            name: input.customerName,
            phone: input.customerPhone,
            email: input.customerEmail || null,
          },
        });
      }

      const shop = await tx.shop.findUnique({ where: { id: targetShopId } });

      const newJob = await tx.repairJob.create({
        data: {
          shopId: targetShopId!,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          repairCustomerId: cust.id,
          deviceId,
          problemDescription: input.problemDescription,
          status: RepairStatus.SUBMITTED,
        },
      });

      // Find shop owner or admin for audit note author
      const authorId = shop?.ownerUserId;
      if (authorId) {
        await tx.repairUpdate.create({
          data: {
            repairJobId: newJob.id,
            authorUserId: authorId,
            status: RepairStatus.SUBMITTED,
            note: 'Guest repair booking initiated online via client discovery.',
          },
        });
      }

      return newJob;
    });

    const shortId = job.id.replace(/-/g, '').substring(0, 6).toUpperCase();
    const referenceNumber = `REP-${shortId}`;

    return {
      ticketId: job.id,
      referenceNumber,
      status: job.status,
      brand: input.brand,
      model: input.model,
      problemDescription: job.problemDescription,
      shopId: targetShopId,
      createdAt: job.createdAt,
      message: 'Repair job submitted successfully. Please show this Ticket ID at the store.',
    };
  }

  static async trackRepairGuest(query: { ticketId?: string; phone?: string }) {
    if (!query.ticketId && !query.phone) {
      throw ApiError.badRequest('Either ticketId or phone parameter is required to track a repair');
    }

    const where: any = {};
    if (query.ticketId) {
      // Support exact UUID or REP- prefix
      const cleanId = query.ticketId.replace(/^REP-/i, '');
      where.OR = [
        { id: query.ticketId },
        { id: { startsWith: cleanId.toLowerCase() } },
      ];
    } else if (query.phone) {
      where.customerPhone = query.phone;
    }

    const job = await prisma.repairJob.findFirst({
      where,
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsappNumber: true,
            address: true,
          },
        },
        updates: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            status: true,
            note: true,
            estimatedCostPaise: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!job) {
      throw ApiError.notFound('No repair job found matching the specified Ticket ID or phone number');
    }

    const milestones = [
      RepairStatus.SUBMITTED,
      RepairStatus.UNDER_REVIEW,
      RepairStatus.QUOTED,
      RepairStatus.APPROVED,
      RepairStatus.IN_PROGRESS,
      RepairStatus.READY,
      RepairStatus.COMPLETED,
    ];

    const currentMilestoneIndex = milestones.indexOf(job.status as RepairStatus);
    const shortId = job.id.replace(/-/g, '').substring(0, 6).toUpperCase();

    return {
      ticketId: job.id,
      referenceNumber: `REP-${shortId}`,
      customerName: job.customerName,
      customerPhone: job.customerPhone,
      deviceId: job.deviceId,
      problemDescription: job.problemDescription,
      status: job.status,
      currentMilestoneIndex: currentMilestoneIndex >= 0 ? currentMilestoneIndex : 0,
      milestones: milestones.map((m, idx) => ({
        step: idx + 1,
        status: m,
        isCompleted: currentMilestoneIndex >= 0 && idx <= currentMilestoneIndex,
        isCurrent: currentMilestoneIndex === idx,
      })),
      estimatedCostPaise: job.estimatedCostPaise,
      shop: job.shop,
      updates: job.updates,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
