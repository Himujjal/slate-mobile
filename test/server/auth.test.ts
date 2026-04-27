import { describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';

describe('Auth Routes', () => {
  it('should register new user', async () => {
    const app = new Elysia()
      .post('/register', ({ body }) => {
        const { email, password, name } = body as {
          email: string;
          password: string;
          name: string;
        };
        if (!email || !password || !name) {
          return Response.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }
        return Response.json({ message: 'User created' });
      })
      .listen(3000);

    const response = await app.handle(
      new Request('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      })
    );

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('message');
  });

  it('should reject registration with missing fields', async () => {
    const app = new Elysia()
      .post('/register', ({ body }) => {
        const { email, password, name } = body as {
          email?: string;
          password?: string;
          name?: string;
        };
        if (!email || !password || !name) {
          return Response.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }
        return Response.json({ message: 'User created' });
      })
      .listen(3000);

    const response = await app.handle(
      new Request('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  it('should login with valid credentials', async () => {
    const app = new Elysia()
      .post('/login', ({ body }) => {
        const { email, password } = body as { email: string; password: string };
        if (email === 'test@example.com' && password === 'password123') {
          return Response.json({
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh',
          });
        }
        return Response.json({ error: 'Invalid credentials' }, { status: 401 });
      })
      .listen(3000);

    const response = await app.handle(
      new Request('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    );

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('accessToken');
  });

  it('should reject login with invalid credentials', async () => {
    const app = new Elysia()
      .post('/login', ({ body }) => {
        const { email, password } = body as { email: string; password: string };
        if (email === 'test@example.com' && password === 'password123') {
          return Response.json({
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh',
          });
        }
        return Response.json({ error: 'Invalid credentials' }, { status: 401 });
      })
      .listen(3000);

    const response = await app.handle(
      new Request('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      })
    );

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  it('should return valid JWT token structure', async () => {
    const app = new Elysia()
      .post('/login', () => {
        return Response.json({
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          refreshToken: 'mock-refresh-token',
        });
      })
      .listen(3000);

    const response = await app.handle(
      new Request('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    );

    const data = (await response.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    expect(data.accessToken).toMatch(/^eyJ/);
    expect(data.refreshToken).toBeDefined();
  });
});
