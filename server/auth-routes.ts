import { Elysia } from 'elysia';
import { t } from 'elysia';
import { createTokens, signToken, verifyToken } from './utils/jwt';
import { hashPassword, verifyPassword } from './utils/password';

interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  createdAt: number;
}

const users: Map<string, User> = new Map();

const userStore: Map<string, { id: string; email: string; name: string }> =
  new Map();

const refreshTokens: Set<string> = new Set();

const generateId = (): string => {
  return crypto.randomUUID();
};

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/register',
    async ({ body }) => {
      const { email, password, name } = body as {
        email: string;
        password: string;
        name: string;
      };

      const existingUser = userStore.get(email.toLowerCase());
      if (existingUser) {
        return new Response(JSON.stringify({ error: 'User already exists' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { hash, salt } = await hashPassword(password);
      const id = generateId();
      const user: User = {
        id,
        email: email.toLowerCase(),
        name,
        passwordHash: hash,
        salt,
        createdAt: Date.now(),
      };

      users.set(id, user);
      userStore.set(email.toLowerCase(), { id, email, name });

      const tokens = await createTokens({ id, email });
      refreshTokens.add(tokens.refreshToken);

      return {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: { id, email, name },
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
    async ({ body }) => {
      const { email, password } = body as {
        email: string;
        password: string;
      };

      const user = userStore.get(email.toLowerCase());
      if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const storedUser = users.get(user.id);
      if (!storedUser) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const isValid = await verifyPassword(
        password,
        storedUser.passwordHash,
        storedUser.salt
      );
      if (!isValid) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const tokens = await createTokens({ id: user.id, email: user.email });
      refreshTokens.add(tokens.refreshToken);

      return {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: { id: user.id, email: user.email, name: user.name },
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
    '/refresh',
    async ({ body }) => {
      const { refreshToken } = body as { refreshToken: string };

      if (!refreshTokens.has(refreshToken)) {
        return new Response(
          JSON.stringify({ error: 'Invalid refresh token' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const payload = await verifyToken(refreshToken, 'refresh');
      if (!payload) {
        refreshTokens.delete(refreshToken);
        return new Response(
          JSON.stringify({ error: 'Invalid refresh token' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      refreshTokens.delete(refreshToken);

      const user = users.get(payload.sub);
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const tokens = await createTokens({ id: user.id, email: user.email });
      refreshTokens.add(tokens.refreshToken);

      return {
        token: tokens.accessToken,
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
        refreshTokens.delete(refreshToken);
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token, 'access');
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = users.get(payload.sub);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return { id: user.id, email: user.email, name: user.name };
  });

export type AuthRoutes = typeof authRoutes;
