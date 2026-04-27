const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

const failedAttempts: Map<string, { count: number; lockedUntil: number }> =
  new Map();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export function getClientKey(email: string, ip: string): string {
  return `auth:${email.toLowerCase()}:${ip}`;
}

export function isLockedOut(email: string): boolean {
  const attempt = failedAttempts.get(email.toLowerCase());
  if (!attempt) return false;
  if (Date.now() > attempt.lockedUntil) {
    failedAttempts.delete(email.toLowerCase());
    return false;
  }
  return true;
}

export function recordFailedAttempt(email: string): boolean {
  const key = email.toLowerCase();
  const attempt = failedAttempts.get(key) || { count: 0, lockedUntil: 0 };

  attempt.count += 1;

  if (attempt.count >= MAX_FAILED_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  failedAttempts.set(key, attempt);
  return attempt.count >= MAX_FAILED_ATTEMPTS;
}

export function clearFailedAttempts(email: string) {
  failedAttempts.delete(email.toLowerCase());
}

export function getLockoutRemainingseconds(email: string): number {
  const attempt = failedAttempts.get(email.toLowerCase());
  if (!attempt || attempt.lockedUntil <= Date.now()) return 0;
  return Math.ceil((attempt.lockedUntil - Date.now()) / 1000);
}

const authRateLimit: Map<string, { count: number; windowStart: number }> =
  new Map();

const AUTH_RATE_LIMIT_WINDOW = 60 * 1000;
const AUTH_RATE_LIMIT_MAX = 10;

export function isRateLimitedAuth(email: string): boolean {
  const key = email.toLowerCase();
  const now = Date.now();
  const entry = authRateLimit.get(key);

  if (!entry || now - entry.windowStart > AUTH_RATE_LIMIT_WINDOW) {
    authRateLimit.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > AUTH_RATE_LIMIT_MAX;
}

export function clearRateLimitAuth(email: string) {
  authRateLimit.delete(email.toLowerCase());
}
