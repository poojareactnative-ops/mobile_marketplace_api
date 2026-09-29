import rateLimit from 'express-rate-limit';

export const publicApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again later.',
    },
  },
});

export const enquiryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // max 20 whatsapp enquiries per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many enquiries sent. Please wait a moment before trying again.',
    },
  },
});
