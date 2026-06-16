import rateLimit from 'express-rate-limit';

/**
 * Industry‑level rate limiter.
 * • 15‑minute window
 * • 100 requests per IP (adjustable via env var)
 * • Returns a JSON error with appropriate status code
 * • Sends standard RateLimit headers (RateLimit‑Limit, RateLimit‑Remaining, RateLimit‑Reset)
 */
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX) || 100, // per window per IP
  standardHeaders: true, // Return RateLimit‑* headers
  legacyHeaders: false, // Disable the older X‑RateLimit headers
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  // Customize the handler to keep JSON response shape
  handler: (req, res, /*next*/) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  },
});

export default limiter;
