import fs from 'fs';
import path from 'path';

interface ShopAdminLink {
  adminUserId: string;
  shopId: string;
  createdByUserId: string;
  createdAt: string;
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const FILE_PATH = path.join(DATA_DIR, 'shop_admins.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadLinks(): Map<string, ShopAdminLink> {
  ensureDir();
  if (!fs.existsSync(FILE_PATH)) {
    return new Map();
  }
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const list: ShopAdminLink[] = JSON.parse(raw);
    const map = new Map<string, ShopAdminLink>();
    list.forEach((l) => map.set(l.adminUserId, l));
    return map;
  } catch {
    return new Map();
  }
}

function saveLinks(map: Map<string, ShopAdminLink>) {
  ensureDir();
  const list = Array.from(map.values());
  fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), 'utf-8');
}

export class ShopAdminStore {
  private static links = loadLinks();

  static associateAdmin(adminUserId: string, shopId: string, createdByUserId: string) {
    const link: ShopAdminLink = {
      adminUserId,
      shopId,
      createdByUserId,
      createdAt: new Date().toISOString(),
    };
    this.links.set(adminUserId, link);
    saveLinks(this.links);
  }

  static getShopIdForAdmin(adminUserId: string): string | null {
    const link = this.links.get(adminUserId);
    return link ? link.shopId : null;
  }

  static getAdminsForShop(shopId: string): string[] {
    const adminUserIds: string[] = [];
    for (const link of this.links.values()) {
      if (link.shopId === shopId) {
        adminUserIds.push(link.adminUserId);
      }
    }
    return adminUserIds;
  }

  static removeAdmin(adminUserId: string) {
    this.links.delete(adminUserId);
    saveLinks(this.links);
  }
}
