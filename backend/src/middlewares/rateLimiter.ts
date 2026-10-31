import rateLimit from "express-rate-limit";

/**
 * Rate Limiter untuk rute Autentikasi (Login Email & Login Google)
 * Membatasi maksimal 10 percobaan per 15 menit per alamat IP
 * untuk mencegah serangan Brute-Force & Credential Stuffing.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: process.env.NODE_ENV === "production" ? 10 : 200, // Longgar di development lokal agar developer tidak terkunci
  standardHeaders: true, // Sertakan header RateLimit-* (RFC compliant)
  legacyHeaders: false, // Nonaktifkan header X-RateLimit-*
  message: {
    error: "Terlalu banyak percobaan login dari perangkat ini. Silakan coba lagi setelah 15 menit demi keamanan akun Anda.",
  },
  handler: (req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Rate Limiter untuk Perubahan Kata Sandi
 * Membatasi maksimal 5 percobaan per 15 menit per alamat IP
 */
export const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5 percobaan
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Terlalu banyak percobaan perubahan kata sandi. Silakan tunggu 15 menit sebelum mencoba kembali.",
  },
  handler: (req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});
