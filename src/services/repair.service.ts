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
          deviceId: input.deviceId,
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
}
