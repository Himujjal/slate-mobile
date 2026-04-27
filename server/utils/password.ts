import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

export interface HashResult {
  hash: string;
}

export async function hashPassword(password: string): Promise<HashResult> {
  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  return { hash };
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  return bcrypt.compare(password, storedHash);
}
