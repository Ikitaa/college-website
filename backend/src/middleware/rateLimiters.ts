import rateLimit from "express-rate-limit";

// Generic API limiter — sबैमा baseline ko रूपमा लागू हुने
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 15 minute मा euta IP बाट 300 request matra
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again later." },
});

// Login ko लागि strict limiter — password guessing (brute-force) रोक्नको लागि
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 15 minute मा euta IP बाट 10 login attempt matra
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
});

// Public form submission (contact, admission, student register) ko लागि limiter
// Real user ko लागि generous, tara scripted spam रोक्न पुग्ने।
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions from this IP. Please try again later." },
});