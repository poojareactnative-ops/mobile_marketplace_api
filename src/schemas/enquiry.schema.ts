import { z } from 'zod';

export const whatsappEnquirySchema = z.object({
  shopId: z.string().min(1, 'Shop ID is required'),
  productId: z.string().min(1).optional(),
  offerId: z.string().min(1).optional(),
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerPhone: z.string().min(10, 'Customer phone must be at least 10 digits'),
  message: z.string().min(1, 'Message is required'),
});

export const trackVisitorSchema = z.object({
  visitorId: z.string().min(1, 'visitorId is required'),
  pageUrl: z.string().min(1, 'pageUrl is required'),
  actionType: z.enum(['PAGE_VIEW', 'NEARBY_SEARCH', 'WHATSAPP_ENQUIRY_CLICK']),
  shopId: z.string().min(1).optional(),
  userAgent: z.string().optional(),
});

export type WhatsAppEnquiryInput = z.infer<typeof whatsappEnquirySchema>;
export type TrackVisitorInput = z.infer<typeof trackVisitorSchema>;
