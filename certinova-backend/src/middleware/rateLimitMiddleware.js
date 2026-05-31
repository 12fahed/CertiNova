import rateLimit from 'express-rate-limit';

export const createLimiter = (max, message) =>
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      return res.status(429).json({
        success: false,
        message,
      });
    },
  });

export const verifyLimiter = createLimiter(
  30,
  'Too many verification attempts. Please try again later.'
);

export const decryptLimiter = createLimiter(
  10,
  'Too many decrypt attempts. Please try again later.'
);

export const generationLimiter = createLimiter(20, 'Too many certificate generation requests.');

export const readLimiter = createLimiter(60, 'Too many requests. Please try again later.');
