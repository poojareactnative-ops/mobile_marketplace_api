# Node.js API: Dynamic Landing Page, Seller Dashboard, & System Admin Management

Production-ready Node.js REST API service built with **Node.js, TypeScript, Express, Prisma ORM, MySQL / MariaDB, and Zod validation**.

It replaces static mock data, browser `localStorage`, and file-based JSON stores with a database repository model supporting System User traffic tracking, Super Seller registration approval queues, direct customer WhatsApp enquiries (no guest registration needed), seller dashboard analytics, and customer repair job workflows.

---

## 🛠 Tech Stack

- **Runtime & Language**: Node.js (v20+) + TypeScript
- **Web Framework**: Express.js
- **Database & ORM**: Prisma ORM (Configured with MySQL / MariaDB)
- **Authentication**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Validation**: Zod with custom request body & query validation middleware
- **Security & Privacy**: Helmet, CORS, Rate Limiting (`express-rate-limit`), SHA-256 IP Hashing for visitor privacy
- **Testing**: Vitest + Supertest

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/hyperlocal_marketplace"
JWT_SECRET=super_secret_jwt_key_emp_api_2026
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=super_secret_refresh_jwt_key_emp_api_2026
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*
```

### 3. Initialize & Seed Database

```bash
npm run db:setup
```

Seeds default accounts:
- **System User Admin**: `admin@platform.com` / `AdminPass123!`
- **Approved Super Seller**: `seller@poojamobile.com` / `SellerPass123!`
- **Pending Super Seller**: `pending@newshop.com` / `SellerPass123!`

### 4. Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:4000`. Base API endpoint: `http://localhost:4000/api/v1`.

### 5. Run Integration Tests

```bash
npm test
```

---

## 🔑 Roles & Authorization

| Role | Access Level | Core Permissions |
| --- | --- | --- |
| **Normal User (Visitor / Customer)** | Unauthenticated / Guest | Browse published shops, products, categories; search nearby repair/accessory shops using Haversine calculation; generate formatted WhatsApp enquiry links directly to sellers. **No registration or login required.** |
| **Super Seller** | Authenticated (Subject to System User approval) | Register shop application (`PENDING_APPROVAL`). Once approved by System User, manage shop profile, products, offers, WhatsApp enquiry leads, repair jobs, and view shop performance. |
| **Seller Admin** | Authenticated | Create local customer repair records, manage customer entries, handle shop repair workflows. |
| **System User (Platform Admin)** | Authenticated | Track visitor analytics ("how many users come" - page views, unique visitors, WhatsApp clicks, traffic charts); review and accept/approve or reject Super Seller registration applications; manage platform categories, shops, and landing page content. |

---

## 📡 Key API Endpoints Reference

### 1. Authentication Endpoints

- `POST /api/v1/auth/register-seller`: Register a new Super Seller account & shop details. Account status defaults to `PENDING_APPROVAL`.
- `POST /api/v1/auth/login`: Login for Super Sellers, Seller Admins, and System Users. Rejects `PENDING_APPROVAL` or `REJECTED` accounts with explanatory messages.
- `POST /api/v1/auth/refresh`: Rotate access token using refresh token.
- `POST /api/v1/auth/logout`: Revoke refresh token / clear session.
- `GET /api/v1/auth/me`: Return active user details, role, shop profile, and application approval status.

### 2. Normal User (Customer) Public Endpoints (No Auth Needed)

- `GET /api/v1/public/landing-page`: Fetch landing hero, banners, featured categories, and stats.
- `GET /api/v1/shops/nearby?lat=12.9716&lng=77.5946&radiusMeters=2500`: Fetch active and System-User verified nearby Super Sellers & accessory shops within radius (Haversine formula).
- `GET /api/v1/products/featured?limit=8`: View top featured products.
- `GET /api/v1/categories?type=accessory`: Browse categories.
- `GET /api/v1/shops/:shopId`: View shop profile details and verified badge status.
- `GET /api/v1/shops/:shopId/products`: Browse shop catalogue.
- `POST /api/v1/enquiries/whatsapp`: Initiate a WhatsApp enquiry. Validates request, logs enquiry, increments shop lead count, and generates formatted WhatsApp web/app link (`https://wa.me/<whatsappNumber>?text=...`).
- `POST /api/v1/analytics/track-visitor`: Log visitor traffic event (page view, shop visit, search) with SHA-256 hashed IP for System User analytics.

### 3. System User Endpoints (Traffic Tracking & Super Seller Approvals)

- `GET /api/v1/system/analytics/visitors?period=30d`: **Track user traffic:** Total site visits, unique visitors, daily visitor counts series, top visited shops, and WhatsApp enquiry conversion counts.
- `GET /api/v1/system/seller-applications?status=PENDING`: **Super Seller Queue:** List all registered Super Seller applications awaiting review.
- `GET /api/v1/system/seller-applications/:id`: View detailed application info and shop details.
- `PATCH /api/v1/system/seller-applications/:id/approve`: **Accept Super Seller:** Approve application, update user status to `APPROVED`, set shop `isVerified = true` and `isActive = true`.
- `PATCH /api/v1/system/seller-applications/:id/reject`: Reject application with reason, update status to `REJECTED`.
- `GET /api/v1/system/shops`: Manage all platform shops (activate, suspend, verify).
- `PATCH /api/v1/system/landing-page`: Update landing page sections, banners, and hero text.

### 4. Dynamic Seller Dashboard (Approved Super Sellers)

- `GET /api/v1/seller/dashboard?period=30d`: Aggregate dashboard summary (KPI cards, low stock alerts, WhatsApp enquiry count, repair statistics).
- `GET /api/v1/seller/products`: Paginated product catalogue list for seller's shop.
- `POST /api/v1/seller/products`: Add product with image gallery to seller shop.
- `GET /api/v1/seller/products/:productId`: View single product details.
- `PATCH /api/v1/seller/products/:productId`: Update product details/stock/status.
- `DELETE /api/v1/seller/products/:productId`: Delete product.
- `POST /api/v1/uploads/presign`: Obtain presigned upload URL for product images.
- `GET /api/v1/seller/enquiries`: View logged WhatsApp enquiry leads received by shop.
- `GET /api/v1/seller/shop`: View shop profile.
- `PATCH /api/v1/seller/shop`: Update shop details, WhatsApp number, opening hours.

### 5. Repair Workflow Endpoints

- `POST /api/v1/seller/repair-customers`: Create customer entry.
- `GET /api/v1/seller/repair-customers`: List repair customers.
- `POST /api/v1/seller/repair-jobs`: Submit repair job (status default `SUBMITTED`).
- `GET /api/v1/seller/repair-jobs`: List repair jobs with filters.
- `GET /api/v1/seller/repair-jobs/:jobId`: View repair job detail + audit updates trail.
- `PATCH /api/v1/seller/repair-jobs/:jobId`: Update repair job status / assignment / cost.
- `POST /api/v1/seller/repair-jobs/:jobId/updates`: Add repair audit update note.

---

## 📄 Data Schema Overview

Monetary values use **integer paise** (e.g. `19900` = INR 199.00).

- **User**: System Users, Super Sellers, Seller Admins. Status: `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `ACTIVE`, `SUSPENDED`.
- **SuperSellerApplication**: Approval queue for System User review.
- **Shop**: Seller profiles with location (`latitude`, `longitude`), `isVerified`, and `isActive`.
- **Product & ProductImage**: Catalogue items managed by approved sellers.
- **Category**: Product/repair categories managed by System Users.
- **WhatsAppEnquiry**: Logged leads generated when guest users initiate WhatsApp enquiries.
- **VisitorAnalytics**: Anonymized traffic logs tracking page views, searches, and WhatsApp clicks.
- **RepairJob & RepairUpdate**: Customer repair orders with status audit trails.
- **LandingPageSection**: Content management for public landing page.
