import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const reportLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: 'Too many reports submitted, please try again later.',
  keyGenerator: (req) => {
    return (req as any).user?.id || req.ip;
  }
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts.',
});

export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: 'Admin rate limit exceeded.',
});
