import { type JWTPayload, SignJWT, jwtVerify } from 'jose';

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-256-bit-secret-key-change-in-production'
);

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET ||
    'refresh-token-secret-different-from-access'
);

export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload extends JWTPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function signToken(
  payload: Omit<TokenPayload, 'type'>,
  type: 'access' | 'refresh'
): Promise<string> {
  const secret = type === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
  const expiry = type === 'access' ? ACCESS_TOKEN_EXPIRY : REFRESH_TOKEN_EXPIRY;

  return new SignJWT({ ...payload, type })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .setSubject(payload.sub as string)
    .setJti(crypto.randomUUID())
    .sign(secret);
}

export async function verifyToken(
  token: string,
  type: 'access' | 'refresh'
): Promise<TokenPayload | null> {
  const secret = type === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.type !== type) return null;
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function createTokens(user: {
  id: string;
  email: string;
}): Promise<Tokens> {
  const payload = { sub: user.id, email: user.email };
  const [accessToken, refreshToken] = await Promise.all([
    signToken(payload, 'access'),
    signToken(payload, 'refresh'),
  ]);

  const expiresIn = 15 * 60;

  return { accessToken, refreshToken, expiresIn };
}
