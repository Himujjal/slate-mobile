const ENCODER = new TextEncoder();

export interface HashResult {
  hash: string;
  salt: string;
}

const generateSalt = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
};

async function sha256(data: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    ENCODER.encode(data)
  );
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray, (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 64);
}

export async function hashPassword(password: string): Promise<HashResult> {
  const salt = generateSalt();
  const hash = await sha256(password + salt);
  return { hash, salt };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const hash = await sha256(password + storedSalt);
  return hash === storedHash;
}
