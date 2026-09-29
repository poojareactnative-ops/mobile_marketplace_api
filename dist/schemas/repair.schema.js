"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRepairUpdateSchema = exports.updateRepairJobSchema = exports.createRepairJobSchema = exports.createRepairCustomerSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.createRepairCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    phone: zod_1.z.string().min(10, 'Phone must be at least 10 digits'),
    email: zod_1.z.string().email('Invalid email').optional().or(zod_1.z.literal('')),
});
exports.createRepairJobSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2, 'Customer name is required'),
    customerPhone: zod_1.z.string().min(10, 'Customer phone is required'),
    repairCustomerId: zod_1.z.string().uuid().optional(),
    deviceId: zod_1.z.string().min(1, 'Device identifier is required'),
    problemDescription: zod_1.z.string().min(3, 'Problem description is required'),
    estimatedCostPaise: zod_1.z.number().int().nonnegative().optional(),
    isSellable: zod_1.z.boolean().optional().default(false),
});
exports.updateRepairJobSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(enums_1.RepairStatus).optional(),
    estimatedCostPaise: zod_1.z.number().int().nonnegative().optional(),
    isSellable: zod_1.z.boolean().optional(),
    assignedToUserId: zod_1.z.string().uuid().optional(),
});
exports.createRepairUpdateSchema = zod_1.z.object({
    status: zod_1.z.string().min(1, 'Status is required'),
    note: zod_1.z.string().min(1, 'Note is required'),
    estimatedCostPaise: zod_1.z.number().int().nonnegative().optional(),
});
