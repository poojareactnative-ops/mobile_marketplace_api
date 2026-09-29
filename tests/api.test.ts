import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('EMP API Backend System Test Suite', () => {
  let systemUserToken = '';
  let approvedSellerToken = '';
  let pendingSellerApplicationId = '';
  let pendingSellerEmail = `new_seller_${Date.now()}@example.com`;
  let pendingSellerPassword = 'TestPassword123!';
  let createdProductId = '';
  let createdJobId = '';
  let activeShopId = '';

  beforeAll(async () => {
    // 1. Login as System User Admin
    const sysLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@platform.com', password: 'AdminPass123!' });

    expect(sysLoginRes.status).toBe(200);
    expect(sysLoginRes.body.data.user.role).toBe('SYSTEM_USER');
    systemUserToken = sysLoginRes.body.data.accessToken;

    // 2. Login as Approved Super Seller
    const sellerLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'seller@poojamobile.com', password: 'SellerPass123!' });

    expect(sellerLoginRes.status).toBe(200);
    expect(sellerLoginRes.body.data.user.role).toBe('SUPER_SELLER');
    expect(sellerLoginRes.body.data.user.status).toBe('APPROVED');
    approvedSellerToken = sellerLoginRes.body.data.accessToken;
    activeShopId = sellerLoginRes.body.data.shop.id;
  });

  describe('1. Public / Customer Endpoints (No Auth Required)', () => {
    it('GET /api/v1/public/landing-page - Returns hero, categories, and featured products', async () => {
      const res = await request(app).get('/api/v1/public/landing-page');
      expect(res.status).toBe(200);
      expect(res.body.data.hero).toBeDefined();
      expect(res.body.data.featuredProducts).toBeInstanceOf(Array);
      expect(res.body.data.categories).toBeInstanceOf(Array);
    });

    it('GET /api/v1/shops/nearby - Returns verified nearby shops within radius using Haversine calculation', async () => {
      const res = await request(app)
        .get('/api/v1/shops/nearby')
        .query({ lat: 12.9716, lng: 77.5946, radiusMeters: 5000 });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
      const firstShop = res.body.data[0];
      expect(firstShop.distanceMeters).toBeDefined();
      expect(firstShop.isVerified).toBe(true);
      expect(firstShop.isActive).toBe(true);
    });

    it('POST /api/v1/enquiries/whatsapp - Generates wa.me link and logs enquiry without customer auth', async () => {
      const res = await request(app)
        .post('/api/v1/enquiries/whatsapp')
        .send({
          shopId: activeShopId,
          customerName: 'Guest Customer',
          customerPhone: '+919876500000',
          message: 'Is Tempered Glass in stock for iPhone 15 Pro?',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.enquiryId).toBeDefined();
      expect(res.body.data.whatsappUrl).toContain('https://wa.me/919812345678');
      expect(res.body.data.status).toBe('REDIRECT_TO_WHATSAPP');
    });

    it('POST /api/v1/analytics/track-visitor - Logs page view traffic with hashed IP', async () => {
      const res = await request(app)
        .post('/api/v1/analytics/track-visitor')
        .send({
          visitorId: 'anon-cookie-uuid-101',
          pageUrl: '/shops/nearby',
          actionType: 'PAGE_VIEW',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.success).toBe(true);
    });
  });

  describe('2. Super Seller Registration & System User Approval Lifecycle', () => {
    it('POST /api/v1/auth/register-seller - Registers new Super Seller with PENDING_APPROVAL status', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register-seller')
        .send({
          name: 'Sunil Kumar',
          email: pendingSellerEmail,
          phone: '+919888877777',
          password: pendingSellerPassword,
          shopName: 'Sunil Mobile Hub',
          shopType: 'Smartphone Repair & Accessories',
          address: '100 Feet Road, Indiranagar, Bangalore',
          latitude: 12.9780,
          longitude: 77.6400,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.user.status).toBe('PENDING_APPROVAL');
      expect(res.body.data.shop.isActive).toBe(false);
      expect(res.body.data.shop.isVerified).toBe(false);
      pendingSellerApplicationId = res.body.data.application.id;
    });

    it('POST /api/v1/auth/login - Blocks unapproved Super Seller with 403 error', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: pendingSellerEmail, password: pendingSellerPassword });

      expect(res.status).toBe(403);
      expect(res.body.error.message).toContain('pending approval');
    });

    it('GET /api/v1/system/seller-applications - System User views pending applications queue', async () => {
      const res = await request(app)
        .get('/api/v1/system/seller-applications')
        .query({ status: 'PENDING' })
        .set('Authorization', `Bearer ${systemUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      const appItem = res.body.data.find((a: any) => a.id === pendingSellerApplicationId);
      expect(appItem).toBeDefined();
    });

    it('PATCH /api/v1/system/seller-applications/:id/approve - System User approves application and activates seller', async () => {
      const res = await request(app)
        .patch(`/api/v1/system/seller-applications/${pendingSellerApplicationId}/approve`)
        .set('Authorization', `Bearer ${systemUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('APPROVED');
      expect(res.body.data.user.status).toBe('APPROVED');
      expect(res.body.data.shop.isVerified).toBe(true);
      expect(res.body.data.shop.isActive).toBe(true);
    });

    it('POST /api/v1/auth/login - Newly approved Super Seller can now log in successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: pendingSellerEmail, password: pendingSellerPassword });

      expect(res.status).toBe(200);
      expect(res.body.data.user.status).toBe('APPROVED');
      expect(res.body.data.accessToken).toBeDefined();
    });
  });

  describe('3. System User Traffic Analytics', () => {
    it('GET /api/v1/system/analytics/visitors - Returns visitor counts, daily traffic series, and top visited shops', async () => {
      const res = await request(app)
        .get('/api/v1/system/analytics/visitors?period=30d')
        .set('Authorization', `Bearer ${systemUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.summary.totalPageViews).toBeGreaterThanOrEqual(0);
      expect(res.body.data.summary.uniqueVisitors).toBeGreaterThanOrEqual(0);
      expect(res.body.data.summary.whatsAppEnquiriesTriggered).toBeGreaterThanOrEqual(1);
      expect(res.body.data.dailyTrafficSeries).toBeInstanceOf(Array);
    });
  });

  describe('4. Approved Seller Dashboard & Product Management', () => {
    it('GET /api/v1/seller/dashboard - Returns aggregated summary KPI metrics', async () => {
      const res = await request(app)
        .get('/api/v1/seller/dashboard')
        .set('Authorization', `Bearer ${approvedSellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.kpi.totalProducts).toBeGreaterThanOrEqual(1);
      expect(res.body.data.kpi.totalEnquiries).toBeGreaterThanOrEqual(1);
    });

    it('POST /api/v1/seller/products - Creates a new product for seller shop', async () => {
      const catRes = await request(app).get('/api/v1/categories');
      const categoryId = catRes.body.data[0].id;

      const res = await request(app)
        .post('/api/v1/seller/products')
        .set('Authorization', `Bearer ${approvedSellerToken}`)
        .send({
          categoryId,
          name: 'Fast Charging Type-C Cable 2m',
          brand: 'PowerPro',
          sku: 'CBL-TC-2M',
          pricePaise: 29900,
          stock: 25,
          status: 'ACTIVE',
          description: 'Braided fast charging cable with 480Mbps data sync.',
          images: [
            { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500', position: 0 }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.pricePaise).toBe(29900);
      createdProductId = res.body.data.id;
    });

    it('PATCH /api/v1/seller/products/:id - Updates product stock and price', async () => {
      const res = await request(app)
        .patch(`/api/v1/seller/products/${createdProductId}`)
        .set('Authorization', `Bearer ${approvedSellerToken}`)
        .send({
          pricePaise: 24900,
          stock: 40,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.pricePaise).toBe(24900);
      expect(res.body.data.stock).toBe(40);
    });

    it('DELETE /api/v1/seller/products/:id - Deletes product', async () => {
      const res = await request(app)
        .delete(`/api/v1/seller/products/${createdProductId}`)
        .set('Authorization', `Bearer ${approvedSellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.success).toBe(true);
    });
  });

  describe('5. Repair Job Workflow APIs', () => {
    it('POST /api/v1/seller/repair-jobs - Submits a new customer repair job', async () => {
      const res = await request(app)
        .post('/api/v1/seller/repair-jobs')
        .set('Authorization', `Bearer ${approvedSellerToken}`)
        .send({
          customerName: 'Deepak Verma',
          customerPhone: '+919777766666',
          deviceId: 'OnePlus 11 5G',
          problemDescription: 'Battery draining fast & charging port loose.',
          estimatedCostPaise: 280000,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.status).toBe('SUBMITTED');
      createdJobId = res.body.data.id;
    });

    it('POST /api/v1/seller/repair-jobs/:id/updates - Adds status audit note', async () => {
      const res = await request(app)
        .post(`/api/v1/seller/repair-jobs/${createdJobId}/updates`)
        .set('Authorization', `Bearer ${approvedSellerToken}`)
        .send({
          status: 'IN_PROGRESS',
          note: 'Replacement battery and USB port module installed.',
          estimatedCostPaise: 280000,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('GET /api/v1/seller/repair-jobs/:id - Retrieves job details with update audit trail', async () => {
      const res = await request(app)
        .get(`/api/v1/seller/repair-jobs/${createdJobId}`)
        .set('Authorization', `Bearer ${approvedSellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('IN_PROGRESS');
      expect(res.body.data.updates.length).toBeGreaterThanOrEqual(2);
    });
  });
});
