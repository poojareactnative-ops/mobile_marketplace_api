# Hyperlocal Mobile Marketplace - Backend REST API & Swagger UI

Production-grade Node.js & TypeScript REST API service supporting the multi-tier hierarchy, Super Admin request approvals & future monetization, Super Seller store staff management, and frictionless zero-registration client discovery with live Swagger documentation.

---

## 📖 Live Swagger (OpenAPI 3.0) Documentation

- **Interactive Swagger UI:** [http://localhost:4000/api-docs](http://localhost:4000/api-docs) (or `/docs`)
- **Raw OpenAPI JSON Specification:** [http://localhost:4000/api-docs.json](http://localhost:4000/api-docs.json)
- **API Base URL:** [http://localhost:4000/api/v1](http://localhost:4000/api/v1)

---

## 🏛 Multi-Tier Role Hierarchy & Permissions

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 1. SUPER ADMIN (Platform Owner)                        │
│  • Reviews & accepts/approves Super Seller registration requests                       │
│  • Future Paid Monetization (No Gateway): Manages listing tiers & manual verification  │
│  • Platform-wide governance, shop activation, global categories, and traffic oversight │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ (Accepts / Approves Request)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              2. SUPER SELLER (Shop Owner)                              │
│  • Registers shop request (waits for Super Admin acceptance & activation)              │
│  • Creates and manages Admins (Seller Admins / Store Managers) for their shop          │
│  • Manages product catalogue, inventory, promotional offers, and shop profile          │
│  • Reviews repair diagnostic solutions and tracks shop-level revenue                   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ (Creates & Manages Admins)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           3. ADMIN / SELLER ADMIN (Shop Staff / Manager)               │
│  • Created & governed by the Super Seller                                              │
│  • Manages store users: logs walk-in customers, customer repair history & complaints   │
│  • Submits local customer repair problems, updates tickets, and handles customer leads  │
└────────────────────────────────────────────────────────────────────────────────────────┘

                                            ▲
                                            │ (Interacts via WhatsApp / In-Store)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        4. CLIENT USER / VISITOR (End Consumer)                         │
│  ★ NO REGISTRATION OR LOGIN REQUIRED AT ALL!                                           │
│  • Discovers products & repair shops NEAREST to their live GPS location (Haversine geo)│
│  • Adjusts live proximity search radius (500m to 10km)                                 │
│  • Initiates pre-filled WhatsApp enquiries directly to sellers                         │
│  • Books and tracks repair status online with simple Phone / Ticket ID                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Key Architectural Guarantees

1. **Zero-Friction Client Experience:** End consumers browse freely as guests without passwords, sign-ups, or verification barriers. They find products and shops strictly based on physical proximity (nearest first).
2. **Super Admin Approval Gate (No Payment Gateway):** Super Sellers cannot access the system immediately upon registration. Their profile sits in a `PENDING_APPROVAL` queue. The Super Admin reviews the request, verifies shop details, assigns tier/status (e.g. Free or Manually Verified Paid Tier), and approves activation directly. **No external payment gateway (e.g., Razorpay, Stripe) is involved or required.**
3. **Delegated Admin Management:** The Super Seller has full administrative capability over their shop staff (`SELLER_ADMIN`). They can create admin accounts, set credentials, grant permissions, and suspend or revoke them at will.
4. **Local User/Customer Management by Admins:** Shop Admins manage their local customer base directly (recording customer walk-ins, phone numbers, repair histories, and service inquiries).
5. **Integer Paise Financial Precision:** All product prices, listing fees, and repair quotes are integer paise (`₹199.00` = `19900 paise`).

---

## 📚 Endpoints Summary by Tier

### 1. Authentication & Onboarding
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/auth/register-super-seller` | Super Seller Onboarding Registration (Pending queue) | Public |
| `POST` | `/api/v1/auth/login` | Login with Email & Password | Public |
| `POST` | `/api/v1/auth/refresh` | Refresh Access Token | Public |
| `GET` | `/api/v1/auth/me` | Current Authenticated Profile & Shop | Bearer |
| `POST` | `/api/v1/auth/logout` | Revoke session | Bearer |

### 2. Tier 1: Super Admin (Platform Owner)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/super-admin/requests` | List Pending Onboarding Requests | `SUPER_ADMIN` |
| `PATCH` | `/api/v1/super-admin/requests/:id/approve` | Accept & Activate Super Seller & Storefront | `SUPER_ADMIN` |
| `PATCH` | `/api/v1/super-admin/requests/:id/reject` | Reject Onboarding Request | `SUPER_ADMIN` |
| `GET` | `/api/v1/super-admin/plans` | List Monetization Subscription Plans | `SUPER_ADMIN` |
| `POST` | `/api/v1/super-admin/plans` | Create / Configure Listing Subscription Plan | `SUPER_ADMIN` |
| `GET` | `/api/v1/super-admin/analytics` | Platform Traffic, Visitor & Lead Analytics | `SUPER_ADMIN` |

### 3. Tier 2: Super Seller (Shop Owner)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/super-seller/admins` | Create Store Admin (`SELLER_ADMIN`) | `SUPER_SELLER` |
| `GET` | `/api/v1/super-seller/admins` | List Store Admins for Current Shop | `SUPER_SELLER` |
| `PATCH` | `/api/v1/super-seller/admins/:adminId` | Suspend or Reactivate Store Admin | `SUPER_SELLER` |
| `DELETE`| `/api/v1/super-seller/admins/:adminId` | Remove Store Admin from Shop | `SUPER_SELLER` |
| `GET` | `/api/v1/seller/dashboard` | Shop KPI Overview & Summary | `SUPER_SELLER`, `SELLER_ADMIN` |
| `GET` | `/api/v1/seller/products` | Manage Catalog Inventory | `SUPER_SELLER`, `SELLER_ADMIN` |
| `POST` | `/api/v1/seller/products` | Add New Product | `SUPER_SELLER`, `SELLER_ADMIN` |
| `GET` | `/api/v1/seller/shop` | View Storefront Profile | `SUPER_SELLER`, `SELLER_ADMIN` |
| `PATCH` | `/api/v1/seller/shop` | Update Store Details & WhatsApp Number | `SUPER_SELLER` |
| `GET` | `/api/v1/seller/enquiries` | View WhatsApp Leads | `SUPER_SELLER`, `SELLER_ADMIN` |

### 4. Tier 3: Seller Admin (Store Staff / Manager)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/seller/admin/customers` | List Store Walk-In Customers | `SELLER_ADMIN`, `SUPER_SELLER` |
| `POST` | `/api/v1/seller/admin/customers` | Register / Log Walk-In Customer | `SELLER_ADMIN`, `SUPER_SELLER` |
| `POST` | `/api/v1/seller/admin/repair-jobs` | Submit Customer Repair Job | `SELLER_ADMIN`, `SUPER_SELLER` |
| `GET` | `/api/v1/seller/admin/repair-jobs` | List Store Repair Tickets | `SELLER_ADMIN`, `SUPER_SELLER` |
| `GET` | `/api/v1/seller/admin/repair-jobs/:id` | Repair Ticket Details & Audit History | `SELLER_ADMIN`, `SUPER_SELLER` |
| `PATCH` | `/api/v1/seller/admin/repair-jobs/:id` | Update Diagnostic Status & Repair Quote | `SELLER_ADMIN`, `SUPER_SELLER` |
| `POST` | `/api/v1/seller/admin/repair-jobs/:id/updates` | Append Diagnostic Audit Note | `SELLER_ADMIN`, `SUPER_SELLER` |

### 5. Tier 4: Client User / Visitor (Zero Registration Required)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/public/products/nearest` | **Haversine Geo-Search** (Nearest products first) | **None (Guest)** |
| `GET` | `/api/v1/shops/nearby` | Proximity Nearby Stores Search | **None (Guest)** |
| `POST` | `/api/v1/enquiries` | **Direct WhatsApp Enquiry** (Pre-filled URL lead) | **None (Guest)** |
| `POST` | `/api/v1/public/repairs/book` | **Guest Online Repair Booking** | **None (Guest)** |
| `GET` | `/api/v1/public/repairs/track` | **Live Milestone Progress Tracking** | **None (Guest)** |
| `GET` | `/api/v1/public/landing-page` | Dynamic Landing Page Content & Stats | **None (Guest)** |
| `GET` | `/api/v1/categories` | Catalog Categories | **None (Guest)** |
| `GET` | `/api/v1/shops/:shopId` | Public Storefront Profile | **None (Guest)** |
| `GET` | `/api/v1/shops/:shopId/products` | Public Products for Store | **None (Guest)** |
| `GET` | `/api/v1/products/featured` | Curated Featured Products | **None (Guest)** |

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open Swagger UI
open http://localhost:4000/api-docs
```
