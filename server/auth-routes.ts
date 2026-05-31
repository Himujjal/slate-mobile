import { Elysia, t } from 'elysia';
import { table } from '../storage';
import { clearRateLimitAuth, isRateLimitedAuth } from './utils/auth-security';
import { createTokens, verifyToken } from './utils/jwt';
import {
  generateOtp,
  getLastOtp,
  isValidEmail,
  isValidPhone,
  storeOtp,
  verifyOtp,
} from './utils/otp';
import { sanitizeEmail, sanitizeInput } from './utils/sanitize';

interface UserRecord extends Record<string, unknown> {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  authProvider: string;
  avatarUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

interface RefreshTokenRecord extends Record<string, unknown> {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
}

function makeErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function mapUser(user: UserRecord) {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    authProvider: user.authProvider,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function validateMethod(method: string): 'email' | 'mobile' | null {
  if (method === 'email' || method === 'mobile') return method;
  return null;
}

const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

async function getExistingUser(
  method: 'email' | 'mobile',
  identifier: string
): Promise<UserRecord | undefined> {
  if (method === 'email') {
    const users = table.query<UserRecord>(
      'users',
      (u) => u.email === identifier
    );
    return users[0];
  }
  const users = table.query<UserRecord>('users', (u) => u.phone === identifier);
  return users[0];
}

function createNewUser(
  method: 'email' | 'mobile',
  identifier: string
): UserRecord {
  const id = crypto.randomUUID();
  const now = Date.now();
  const name =
    method === 'email'
      ? identifier.split('@')[0]
      : `User ${identifier.slice(-4)}`;

  const user: UserRecord = {
    id,
    email: method === 'email' ? identifier : null,
    phone: method === 'mobile' ? identifier : null,
    name,
    authProvider: method === 'email' ? 'email_otp' : 'mobile_otp',
    avatarUrl: null,
    createdAt: now,
    updatedAt: now,
  };

  table.insert('users', user);
  return user;
}

function saveRefreshToken(
  userId: string,
  token: string,
  expiresAt: number
): void {
  const id = crypto.randomUUID();
  table.insert('refresh_tokens', {
    id,
    userId,
    token,
    expiresAt,
    createdAt: Date.now(),
  } as RefreshTokenRecord);
}

function findRefreshToken(token: string): RefreshTokenRecord | undefined {
  const tokens = table.query<RefreshTokenRecord>(
    'refresh_tokens',
    (t) => t.token === token
  );
  return tokens[0];
}

function deleteRefreshToken(token: string): void {
  const tokens = table.query<RefreshTokenRecord>(
    'refresh_tokens',
    (t) => t.token === token
  );
  for (const t of tokens) {
    table.delete('refresh_tokens', t.id);
  }
}

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/otp/request',
    async (ctx) => {
      const { email, phone, method } = ctx.body as {
        email?: string;
        phone?: string;
        method: string;
      };
      const validatedMethod = validateMethod(method);
      if (!validatedMethod) {
        return makeErrorResponse(
          'Invalid method. Use "email" or "mobile"',
          400
        );
      }

      let identifier: string;
      if (validatedMethod === 'email') {
        if (!email || !isValidEmail(email)) {
          return makeErrorResponse('Valid email is required', 400);
        }
        identifier = sanitizeEmail(email);
      } else {
        if (!phone || !isValidPhone(phone)) {
          return makeErrorResponse(
            'Valid phone number with country code is required (e.g. +1234567890)',
            400
          );
        }
        identifier = phone;
      }

      const ipForwarded = ctx.request.headers.get('x-forwarded-for');
      const ipReal = ctx.request.headers.get('x-real-ip');
      const clientIp = ipForwarded?.split(',')[0] || ipReal || 'unknown';
      const rateLimitKey = `${identifier}:${clientIp}`;

      if (isRateLimitedAuth(rateLimitKey)) {
        return makeErrorResponse(
          'Too many requests. Please try again later',
          429
        );
      }

      const otp = generateOtp();
      storeOtp(identifier, otp);

      clearRateLimitAuth(rateLimitKey);

      return {
        message: `OTP sent to ${validatedMethod === 'email' ? email : phone}`,
        identifier,
        method: validatedMethod,
      };
    },
    {
      body: t.Object({
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        method: t.String(),
      }),
    }
  )
  .post(
    '/otp/verify',
    async ({ body }) => {
      const { email, phone, otp, method } = body as {
        email?: string;
        phone?: string;
        otp: string;
        method: string;
      };

      const validatedMethod = validateMethod(method);
      if (!validatedMethod) {
        return makeErrorResponse(
          'Invalid method. Use "email" or "mobile"',
          400
        );
      }

      let identifier: string;
      if (validatedMethod === 'email') {
        if (!email) {
          return makeErrorResponse('Email is required', 400);
        }
        identifier = sanitizeEmail(email);
      } else {
        if (!phone) {
          return makeErrorResponse('Phone is required', 400);
        }
        identifier = phone;
      }

      if (!otp || otp.length < 4) {
        return makeErrorResponse('Valid OTP is required', 400);
      }

      const isValid = verifyOtp(identifier, otp);
      if (!isValid) {
        return makeErrorResponse('Invalid or expired OTP', 401);
      }

      let user = await getExistingUser(validatedMethod, identifier);

      if (!user) {
        user = createNewUser(validatedMethod, identifier);
      }

      const userEmail = user.email || '';
      const tokens = await createTokens({ id: user.id, email: userEmail });
      const expiresAt = Date.now() + REFRESH_TOKEN_EXPIRY_MS;
      saveRefreshToken(user.id, tokens.refreshToken, expiresAt);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: mapUser(user),
        expiresIn: tokens.expiresIn,
      };
    },
    {
      body: t.Object({
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        otp: t.String(),
        method: t.String(),
      }),
    }
  )
  .post(
    '/apple',
    async ({ body }) => {
      const { idToken } = body as { idToken: string };

      if (!idToken) {
        return makeErrorResponse('Apple ID token is required', 400);
      }

      return makeErrorResponse('Apple sign-in is not yet implemented', 501);
    },
    {
      body: t.Object({
        idToken: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/refresh',
    async ({ body }) => {
      const { refreshToken } = body as { refreshToken: string };

      const storedToken = findRefreshToken(refreshToken);

      if (!storedToken) {
        return makeErrorResponse('Invalid refresh token', 401);
      }

      if (storedToken.expiresAt < Date.now()) {
        deleteRefreshToken(refreshToken);
        return makeErrorResponse('Refresh token expired', 401);
      }

      const payload = await verifyToken(refreshToken, 'refresh');
      if (!payload) {
        deleteRefreshToken(refreshToken);
        return makeErrorResponse('Invalid refresh token', 401);
      }

      deleteRefreshToken(refreshToken);

      const user = table.find<UserRecord>('users', payload.sub);

      if (!user) {
        return makeErrorResponse('User not found', 401);
      }

      const tokens = await createTokens({
        id: user.id,
        email: user.email || '',
      });
      const expiresAt = Date.now() + REFRESH_TOKEN_EXPIRY_MS;
      saveRefreshToken(user.id, tokens.refreshToken, expiresAt);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      };
    },
    {
      body: t.Object({
        refreshToken: t.String(),
      }),
    }
  )
  .post(
    '/logout',
    async ({ body }) => {
      const { refreshToken } = body as { refreshToken?: string };

      if (refreshToken) {
        deleteRefreshToken(refreshToken);
      }

      return { success: true };
    },
    {
      body: t.Object({
        refreshToken: t.Optional(t.String()),
      }),
    }
  )
  .get('/me', async (ctx) => {
    const authHeader = ctx.request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return makeErrorResponse('Unauthorized', 401);
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token, 'access');
    if (!payload) {
      return makeErrorResponse('Invalid token', 401);
    }

    const user = table.find<UserRecord>('users', payload.sub);

    if (!user) {
      return makeErrorResponse('User not found', 401);
    }

    return mapUser(user);
  });

export type AuthRoutes = typeof authRoutes;
