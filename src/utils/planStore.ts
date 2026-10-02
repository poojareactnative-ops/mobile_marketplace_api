import fs from 'fs';
import path from 'path';
import { PlanTier } from '../types/enums';

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  pricePaise: number;
  durationDays: number;
  maxProducts: number;
  maxAdmins: number;
  featuresJson: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const FILE_PATH = path.join(DATA_DIR, 'plans.json');

const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-standard-free',
    code: 'STANDARD_FREE',
    name: 'Standard Free',
    pricePaise: 0,
    durationDays: 365,
    maxProducts: 25,
    maxAdmins: 1,
    featuresJson: {
      priorityNearbyRanking: false,
      whatsappLeadAnalytics: false,
      verifiedBadgeIncluded: false,
    },
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'plan-starter-monthly',
    code: 'STARTER_MONTHLY',
    name: 'Starter Super Seller',
    pricePaise: 99900, // ₹999.00
    durationDays: 30,
    maxProducts: 100,
    maxAdmins: 3,
    featuresJson: {
      priorityNearbyRanking: true,
      whatsappLeadAnalytics: true,
      verifiedBadgeIncluded: true,
    },
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'plan-pro-annual',
    code: 'PRO_ANNUAL',
    name: 'Pro Annual Super Seller',
    pricePaise: 999900, // ₹9,999.00
    durationDays: 365,
    maxProducts: 500,
    maxAdmins: 10,
    featuresJson: {
      priorityNearbyRanking: true,
      whatsappLeadAnalytics: true,
      verifiedBadgeIncluded: true,
      dedicatedAccountManager: true,
    },
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadPlans(): SubscriptionPlan[] {
  ensureDir();
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULT_PLANS, null, 2), 'utf-8');
    return DEFAULT_PLANS;
  }
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PLANS;
  }
}

function savePlans(plans: SubscriptionPlan[]) {
  ensureDir();
  fs.writeFileSync(FILE_PATH, JSON.stringify(plans, null, 2), 'utf-8');
}

export class PlanStore {
  private static plans: SubscriptionPlan[] = loadPlans();

  static getAll(): SubscriptionPlan[] {
    return this.plans.filter((p) => p.isActive);
  }

  static getByCode(code: string): SubscriptionPlan | undefined {
    return this.plans.find((p) => p.code.toUpperCase() === code.toUpperCase());
  }

  static create(input: {
    code: string;
    name: string;
    pricePaise: number;
    durationDays?: number;
    maxProducts?: number;
    maxAdmins?: number;
    featuresJson?: Record<string, any>;
    isActive?: boolean;
  }): SubscriptionPlan {
    const newPlan: SubscriptionPlan = {
      id: `plan-${Date.now()}`,
      code: input.code.toUpperCase(),
      name: input.name,
      pricePaise: input.pricePaise,
      durationDays: input.durationDays ?? 30,
      maxProducts: input.maxProducts ?? 100,
      maxAdmins: input.maxAdmins ?? 3,
      featuresJson: input.featuresJson || {},
      isActive: input.isActive ?? true,
      createdAt: new Date().toISOString(),
    };

    const existingIndex = this.plans.findIndex((p) => p.code === newPlan.code);
    if (existingIndex >= 0) {
      this.plans[existingIndex] = newPlan;
    } else {
      this.plans.push(newPlan);
    }

    savePlans(this.plans);
    return newPlan;
  }
}
