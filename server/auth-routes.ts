import { Elysia, t } from 'elysia';
import type { Kysely } from 'kysely';
import { getDb } from './db';
import type { Database } from './db/database';
import {
  clearFailedAttempts,
  clearRateLimitAuth,
  getLockoutRemainingseconds,
  isLockedOut,
  isRateLimitedAuth,
  isValidEmail,
  recordFailedAttempt,
} from './utils/auth-security';
import { createTokens, verifyToken } from './utils/jwt';
import { hashPassword, verifyPassword } from './utils/password';
import { sanitizeEmail, sanitizeInput } from './utils/sanitize';

function makeErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function mapUser(user: {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: number;
  updated_at: number;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

async function saveRefreshToken(
  db: Kysely<Database>,
  userId: string,
  token: string,
  expiresAt: number
) {
  const now = Date.now();
  await db
    .insertInto('refresh_tokens')
    .values({
      user_id: userId,
      token,
      expires_at: expiresAt,
      created_at: now,
    })
    .execute();
}

async function deleteRefreshToken(db: Kysely<Database>, token: string) {
  await db.deleteFrom('refresh_tokens').where('token', '=', token).execute();
}

async function cleanExpiredTokens(db: Kysely<Database>) {
  await db
    .deleteFrom('refresh_tokens')
    .where('expires_at', '<', Date.now())
    .execute();
}

type UserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  salt: string | null;
  google_id: string | null;
  avatar_url: string | null;
  created_at: number;
  updated_at: number;
};

const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/register',
    async ({ body, headers }) => {
      const { email, password, name } = body as {
        email: string;
        password: string;
        name: string;
      };

      if (!isValidEmail(email)) {
        return makeErrorResponse('Invalid email format', 400);
      }

      const clientIp =
        headers['x-forwarded-for']?.split(',')[0] ||
        headers['x-real-ip'] ||
        'unknown';
      const rateLimitKey = `${email}:${clientIp}`;

      if (isRateLimitedAuth(rateLimitKey)) {
        return makeErrorResponse(
          'Too many requests. Please try again later',
          429
        );
      }

      const sanitizedEmail = sanitizeEmail(email);
      const sanitizedName = sanitizeInput(name);

      const db = getDb() as Kysely<Database>;

      const existing = await db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', sanitizedEmail)
        .executeTakeFirst();

      if (existing) {
        return makeErrorResponse('User already exists', 400);
      }

      if (password.length < 8) {
        return makeErrorResponse('Password must be at least 8 characters', 400);
      }

      const { hash } = await hashPassword(password);
      const id = crypto.randomUUID();
      const now = Date.now();

      await db
        .insertInto('users')
        .values({
          id,
          email: email.toLowerCase(),
          name: name.trim(),
          password_hash: hash,
          salt: null,
          google_id: null,
          avatar_url: null,
          created_at: now,
          updated_at: now,
        })
        .execute();

      clearRateLimitAuth(rateLimitKey);

      const tokens = await createTokens({ id, email: email.toLowerCase() });
      const expiresAt = Date.now() + REFRESH_TOKEN_EXPIRY_MS;
      await saveRefreshToken(db, id, tokens.refreshToken, expiresAt);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: { id, email: sanitizedEmail, name: sanitizedName },
        expiresIn: tokens.expiresIn,
      };
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
        name: t.String({ minLength: 1 }),
      }),
    }
  )
  .post(
    '/login',
    async ({ body, headers }) => {
      const { email, password } = body as {
        email: string;
        password: string;
      };

      if (!isValidEmail(email)) {
        return makeErrorResponse('Invalid email format', 400);
      }

      const clientIp =
        headers['x-forwarded-for']?.split(',')[0] ||
        headers['x-real-ip'] ||
        'unknown';
      const rateLimitKey = `${email}:${clientIp}`;

      if (isRateLimitedAuth(rateLimitKey)) {
        return makeErrorResponse(
          'Too many requests. Please try again later',
          429
        );
      }

      const sanitizedEmail = sanitizeEmail(email);

      if (isLockedOut(sanitizedEmail)) {
        const remaining = getLockoutRemainingseconds(sanitizedEmail);
        return makeErrorResponse(
          `Account locked. Try again in ${Math.ceil(remaining / 60)} minutes`,
          429
        );
      }

      const db = getDb() as Kysely<Database>;

      const user = (await db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', sanitizedEmail)
        .executeTakeFirst()) as UserRow | undefined;

      if (!user || !user.password_hash) {
        return makeErrorResponse('Invalid credentials', 401);
      }

      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) {
        const isLocked = recordFailedAttempt(sanitizedEmail);
        if (isLocked) {
          return makeErrorResponse(
            'Too many failed attempts. Account locked for 15 minutes',
            429
          );
        }
        return makeErrorResponse('Invalid credentials', 401);
      }

      clearFailedAttempts(sanitizedEmail);
      clearRateLimitAuth(rateLimitKey);

      const tokens = await createTokens({ id: user.id, email: user.email });
      const expiresAt = Date.now() + REFRESH_TOKEN_EXPIRY_MS;
      await saveRefreshToken(db, user.id, tokens.refreshToken, expiresAt);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: mapUser(user),
        expiresIn: tokens.expiresIn,
      };
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    }
  )
  .post(
    '/google',
    async ({ body }) => {
      const { idToken } = body as { idToken: string };

      const db = getDb() as Kysely<Database>;
      const googleClientId = process.env.GOOGLE_CLIENT_ID;

      let payload: {
        sub: string;
        email: string;
        name: string;
        picture?: string;
        aud?: string;
      };
      try {
        const verifyUrl = googleClientId
          ? `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}&client_id=${googleClientId}`
          : `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`;
        const response = await fetch(verifyUrl);
        payload = await response.json();
      } catch {
        return makeErrorResponse('Invalid Google token', 401);
      }

      if (!payload.sub || !payload.email) {
        return makeErrorResponse('Invalid Google token', 401);
      }

      if (googleClientId && payload.aud !== googleClientId) {
        return makeErrorResponse('Invalid Google token audience', 401);
      }

      let user = (await db
        .selectFrom('users')
        .selectAll()
        .where('google_id', '=', payload.sub)
        .executeTakeFirst()) as UserRow | undefined;

      if (!user) {
        const existingEmail = (await db
          .selectFrom('users')
          .selectAll()
          .where('email', '=', payload.email.toLowerCase())
          .executeTakeFirst()) as UserRow | undefined;

        if (existingEmail) {
          return makeErrorResponse(
            'email already registered. Please login with password.',
            400
          );
        }

        const id = crypto.randomUUID();
        const now = Date.now();

        await db
          .insertInto('users')
          .values({
            id,
            email: payload.email.toLowerCase(),
            name: payload.name || payload.email.split('@')[0],
            password_hash: null,
            salt: null,
            google_id: payload.sub,
            avatar_url: payload.picture || null,
            created_at: now,
            updated_at: now,
          })
          .execute();

        user = {
          id,
          email: payload.email.toLowerCase(),
          name: payload.name || payload.email.split('@')[0],
          password_hash: null,
          salt: null,
          google_id: payload.sub,
          avatar_url: payload.picture || null,
          created_at: now,
          updated_at: now,
        };
      }

      await cleanExpiredTokens(db);

      const tokens = await createTokens({ id: user.id, email: user.email });
      const expiresAt = Date.now() + REFRESH_TOKEN_EXPIRY_MS;
      await saveRefreshToken(db, user.id, tokens.refreshToken, expiresAt);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: mapUser(user),
        expiresIn: tokens.expiresIn,
      };
    },
    {
      body: t.Object({
        idToken: t.String(),
      }),
    }
  )
  .post(
    '/refresh',
    async ({ body }) => {
      const { refreshToken } = body as { refreshToken: string };

      const db = getDb() as Kysely<Database>;

      const storedToken = await db
        .selectFrom('refresh_tokens')
        .selectAll()
        .where('token', '=', refreshToken)
        .executeTakeFirst();

      if (!storedToken) {
        return makeErrorResponse('Invalid refresh token', 401);
      }

      if (storedToken.expires_at < Date.now()) {
        await deleteRefreshToken(db, refreshToken);
        return makeErrorResponse('Refresh token expired', 401);
      }

      const payload = await verifyToken(refreshToken, 'refresh');
      if (!payload) {
        await deleteRefreshToken(db, refreshToken);
        return makeErrorResponse('Invalid refresh token', 401);
      }

      await deleteRefreshToken(db, refreshToken);

      const user = (await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', payload.sub)
        .executeTakeFirst()) as UserRow | undefined;

      if (!user) {
        return makeErrorResponse('User not found', 401);
      }

      const tokens = await createTokens({ id: user.id, email: user.email });
      const expiresAt = Date.now() + REFRESH_TOKEN_EXPIRY_MS;
      await saveRefreshToken(db, user.id, tokens.refreshToken, expiresAt);

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
        const db = getDb() as Kysely<Database>;
        await deleteRefreshToken(db, refreshToken);
      }

      return { success: true };
    },
    {
      body: t.Object({
        refreshToken: t.Optional(t.String()),
      }),
    }
  )
  .get('/me', async ({ headers }) => {
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return makeErrorResponse('Unauthorized', 401);
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token, 'access');
    if (!payload) {
      return makeErrorResponse('Invalid token', 401);
    }

    const db = getDb() as Kysely<Database>;
    const user = (await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', payload.sub)
      .executeTakeFirst()) as UserRow | undefined;

    if (!user) {
      return makeErrorResponse('User not found', 401);
    }

    return mapUser(user);
  });

export type AuthRoutes = typeof authRoutes;
