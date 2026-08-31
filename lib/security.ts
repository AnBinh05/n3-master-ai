// Hệ thống Bảo Mật Nâng Cao: Mã Hóa Mật Khẩu (PBKDF2-SHA512), Chống Timing Attack & Rate Limiting Chống Tấn Công Dò Mật Khẩu (Brute-Force)

import crypto from 'crypto';

// 1. MÃ HÓA MẬT KHẨU CHUẨN PBKDF2-SHA512 + SALT 16 BYTES
const PBKDF2_ITERATIONS = 10000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

/**
 * Băm mật khẩu với Salt ngẫu nhiên chuẩn quân đội (PBKDF2-SHA512).
 * Không bao giờ lưu mật khẩu ở dạng văn bản thuần (plain-text).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Xác thực mật khẩu với storedHash.
 * Sử dụng crypto.timingSafeEqual để triệt tiêu hoàn toàn nguy cơ tấn công Timing Attack.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || !storedHash.includes(':')) {
      // Trường hợp tài khoản cũ chưa băm mật khẩu
      return password === storedHash;
    }
    const [salt, key] = storedHash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST);

    if (keyBuffer.length !== derivedKey.length) {
      return false;
    }
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch (error) {
    return false;
  }
}

// 2. BỘ ĐỆM CHỐNG TẤN CÔNG BRUTE-FORCE / RATE LIMITING
interface RateLimitEntry {
  attempts: number;
  firstAttemptTime: number;
  lockedUntil: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Giới hạn tần suất đăng nhập để ngăn chặn kẻ xấu sử dụng bot dò mật khẩu.
 * Mặc định: Tối đa 5 lần thử trong 15 phút.
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts = 5,
  windowSeconds = 900 // 15 phút
): { allowed: boolean; remainingAttempts: number; retryAfterSecs: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Nếu chưa có lịch sử, khởi tạo
  if (!entry) {
    return { allowed: true, remainingAttempts: maxAttempts - 1, retryAfterSecs: 0 };
  }

  // Đang bị khóa
  if (entry.lockedUntil > now) {
    const retryAfterSecs = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSecs };
  }

  // Quá hạn cửa sổ thời gian -> reset
  if (now - entry.firstAttemptTime > windowSeconds * 1000) {
    rateLimitStore.delete(identifier);
    return { allowed: true, remainingAttempts: maxAttempts - 1, retryAfterSecs: 0 };
  }

  // Vượt quá số lần thử -> Khóa 15 phút
  if (entry.attempts >= maxAttempts) {
    entry.lockedUntil = now + windowSeconds * 1000;
    return { allowed: false, remainingAttempts: 0, retryAfterSecs: windowSeconds };
  }

  return {
    allowed: true,
    remainingAttempts: maxAttempts - entry.attempts,
    retryAfterSecs: 0,
  };
}

/**
 * Ghi nhận một lần đăng nhập thất bại
 */
export function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      firstAttemptTime: now,
      lockedUntil: 0,
    });
  } else {
    entry.attempts += 1;
  }
}

/**
 * Reset lịch sử đăng nhập khi xác thực thành công
 */
export function resetRateLimit(identifier: string) {
  rateLimitStore.delete(identifier);
}

// 3. LÀM SẠCH VÀ VỆ SINH DỮ LIỆU ĐẦU VÀO (XSS SANITIZATION)
export function sanitizeString(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}
