import { swaggerSchemas } from './schemas';
import { authSwagger } from './routes/auth.swagger';
import { superAdminSwagger } from './routes/superAdmin.swagger';
import { superSellerSwagger } from './routes/superSeller.swagger';
import { sellerSwagger } from './routes/seller.swagger';
import { repairSwagger } from './routes/repair.swagger';
import { publicSwagger } from './routes/public.swagger';
import { systemSwagger } from './routes/system.swagger';
import { uploadSwagger } from './routes/upload.swagger';
import { healthSwagger } from './routes/health.swagger';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    "title": "Hyperlocal Mobile Marketplace - REST API Specification",
    "version": "1.0.0",
    "description": "\n## Hyperlocal Mobile Marketplace Backend Architecture & REST API\n\nThis API is designed directly from the frontend UI and multi-tier role hierarchy to power hyperlocal mobile and accessories commerce, instant walk-in repair diagnostics, and zero-friction guest discovery.\n\n### 🏛️ Multi-Tier Role Hierarchy & Operational Responsibilities\n\n1. **Super Admin (Platform Owner)**\n   - Reviews and accepts/approves Super Seller registration requests.\n   - Future Paid Monetization (No Gateway): Manages listing tiers and manual verification.\n   - Platform-wide governance, shop activation, global categories, and traffic oversight.\n\n2. **Super Seller (Shop Owner)**\n   - Registers shop request (waits for Super Admin acceptance & activation).\n   - Creates and manages Admins (`SELLER_ADMIN`) for their shop.\n   - Manages product catalogue, inventory, promotional offers, and shop profile.\n\n3. **Admin / Seller Admin (Shop Staff / Manager)**\n   - Created & governed by the Super Seller.\n   - Manages store users: logs walk-in customers, customer repair history & complaints.\n   - Submits local customer repair problems, updates tickets, and handles customer leads.\n\n4. **Client User / Visitor (End Consumer)**\n   - 🌟 **NO REGISTRATION OR LOGIN REQUIRED AT ALL!**\n   - Discovers products & repair shops NEAREST to their live GPS location (Haversine geo-search).\n   - Initiates pre-filled WhatsApp enquiries directly to sellers with click-to-chat links.\n   - Books and tracks repair status online with simple Phone number or Ticket ID.\n\n---\n### ⚙️ Core Architectural Guarantees\n- **Integer Paise Financial Precision:** All product prices, listing fees, and repair quotes are integer paise (`₹199.00` = `19900 paise`).\n- **Zero-Friction Client Experience:** End consumers browse freely as guests without passwords or sign-up fatigue.\n- **Super Admin Approval Gate:** Super Sellers sit in `PENDING_APPROVAL` until reviewed by Super Admin.\n    ",
    "contact": {
        "name": "Hyperlocal Mobile Marketplace Engineering Team",
        "email": "support@hyperlocalmarketplace.internal"
    }
},
  servers: [
    {
        "url": "/api/v1",
        "description": "Default API Endpoint (v1)"
    },
    {
        "url": "http://localhost:4000/api/v1",
        "description": "Local Development Server"
    }
],
  tags: [
    {
        "name": "1. Authentication",
        "description": "User registration, Super Seller onboarding submission, login, token refresh, and profile inspection."
    },
    {
        "name": "2. Tier 1: Super Admin (Platform Owner)",
        "description": "Review & approve/reject onboarding requests, future monetization subscription plans, and platform traffic oversight."
    },
    {
        "name": "3. Tier 2: Super Seller (Shop Owner)",
        "description": "Delegate store staff by creating Admins, manage inventory catalogue, discounts, and shop profile."
    },
    {
        "name": "4. Tier 3: Seller Admin (Store Staff)",
        "description": "Manage store walk-in customers, submit repair jobs, log diagnostic notes, and provide repair quotes."
    },
    {
        "name": "5. Tier 4: Client User / Visitor (Zero Registration)",
        "description": "Frictionless discovery: Haversine nearest products geo-search, nearby shops, direct WhatsApp lead enquiries."
    },
    {
        "name": "6. Repair Services & Online Tracking",
        "description": "Guest online repair booking (no login), repair customer management, and live milestone progress bar ticket tracking."
    },
    {
        "name": "7. System & Analytics",
        "description": "Platform analytics, visitor metrics, system administrator controls, and landing page management."
    },
    {
        "name": "8. Media & File Uploads",
        "description": "Presigned upload URL generator for product pictures, store banners, and business documents."
    },
    {
        "name": "9. Health & System Checks",
        "description": "Service uptime and operational health check diagnostics."
    }
],
  components: {
    securitySchemes: {
      "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Provide your JWT bearer token in the format: Bearer <token>"
      }
},
    schemas: swaggerSchemas,
  },
  paths: {
    ...authSwagger,
    ...superAdminSwagger,
    ...superSellerSwagger,
    ...sellerSwagger,
    ...repairSwagger,
    ...publicSwagger,
    ...systemSwagger,
    ...uploadSwagger,
    ...healthSwagger,
  },
};
