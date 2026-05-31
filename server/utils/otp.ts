const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 5 * 60 * 1000;

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function generateOtp(length = OTP_LENGTH): string {
  const digits = [];
  for (let i = 0; i < length; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }
  return digits.join('');
}

export function storeOtp(identifier: string, otp: string): void {
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  });
}

export function verifyOtp(identifier: string, otp: string): boolean {
  const stored = otpStore.get(identifier);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return false;
  }
  if (stored.otp !== otp) return false;
  otpStore.delete(identifier);
  return true;
}

export function getLastOtp(identifier: string): string | undefined {
  const stored = otpStore.get(identifier);
  return stored?.otp;
}

export function clearOtp(identifier: string): void {
  otpStore.delete(identifier);
}

export function isValidEmail(email: string): boolean {
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

export function isValidPhone(phone: string): boolean {
  const PHONE_REGEX = /^\+[1-9]\d{6,14}$/;
  return PHONE_REGEX.test(phone);
}
