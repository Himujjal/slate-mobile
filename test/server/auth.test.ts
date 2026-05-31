import { beforeEach, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { authRoutes } from '../../server/auth-routes';
import {
  clearOtp,
  getLastOtp,
  isValidEmail,
  isValidPhone,
} from '../../server/utils/otp';
import {
  MemoryKvAdapter,
  MemoryTableAdapter,
  setKvAdapter,
  setTableAdapter,
} from '../../storage';

function createTestApp() {
  return new Elysia().use(authRoutes);
}

async function doOtpFlow(
  app: { handle: (req: Request) => Promise<Response> },
  method: 'email' | 'mobile',
  identifier: string
) {
  const reqBody = {
    method,
    ...(method === 'email' ? { email: identifier } : { phone: identifier }),
  };
  await app.handle(
    new Request('http://localhost:3000/auth/otp/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    })
  );
  const otp = getLastOtp(identifier);
  if (!otp) throw new Error('OTP not generated');
  const verifyBody = {
    method,
    otp,
    ...(method === 'email' ? { email: identifier } : { phone: identifier }),
  };
  return app.handle(
    new Request('http://localhost:3000/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verifyBody),
    })
  );
}

describe('OTP Auth Routes', () => {
  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
    setTableAdapter(new MemoryTableAdapter());
    clearOtp('');
  });

  describe('POST /auth/otp/request', () => {
    it('should request OTP via email', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/otp/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'email',
            email: 'test@example.com',
          }),
        })
      );
      expect(response.status).toBe(200);
      const data = (await response.json()) as Record<string, unknown>;
      expect(String(data.message)).toContain('OTP sent');
      expect(data.identifier).toBe('test@example.com');
      expect(data.method).toBe('email');

      const storedOtp = getLastOtp('test@example.com');
      expect(storedOtp).toBeDefined();
      expect(storedOtp?.length).toBe(6);
    });

    it('should request OTP via mobile', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/otp/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'mobile',
            phone: '+1234567890',
          }),
        })
      );
      expect(response.status).toBe(200);
    });

    it('should reject request with invalid email', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/otp/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'email',
            email: 'notanemail',
          }),
        })
      );
      expect(response.status).toBe(400);
    });

    it('should reject request with invalid phone', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/otp/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'mobile',
            phone: '12345',
          }),
        })
      );
      expect(response.status).toBe(400);
    });

    it('should reject invalid method', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/otp/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'invalid',
            email: 'test@example.com',
          }),
        })
      );
      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/otp/verify', () => {
    const testEmail = 'verify-test@example.com';

    it('should create user and return tokens on first verification', async () => {
      const app = createTestApp();
      const response = await doOtpFlow(app, 'email', testEmail);
      expect(response.status).toBe(200);
      const data = (await response.json()) as Record<string, unknown>;
      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('refreshToken');
      const user = data.user as Record<string, unknown>;
      expect(user.email).toBe(testEmail);
      expect(user.authProvider).toBe('email_otp');
    });

    it('should login existing user', async () => {
      const app = createTestApp();
      const response = await doOtpFlow(app, 'email', testEmail);
      expect(response.status).toBe(200);
      const data = (await response.json()) as Record<string, unknown>;
      expect(data).toHaveProperty('accessToken');
      const user = data.user as Record<string, unknown>;
      expect(user.email).toBe(testEmail);
    });

    it('should reject invalid OTP', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'email',
            email: testEmail,
            otp: '000000',
          }),
        })
      );
      expect(response.status).toBe(401);
    });

    it('should register via mobile', async () => {
      const app = createTestApp();
      const phone = '+1987654321';
      const response = await doOtpFlow(app, 'mobile', phone);
      expect(response.status).toBe(200);
      const data = (await response.json()) as Record<string, unknown>;
      const user = data.user as Record<string, unknown>;
      expect(user.phone).toBe(phone);
      expect(user.authProvider).toBe('mobile_otp');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh tokens', async () => {
      const app = createTestApp();
      const email = 'refresh-test@example.com';
      const verifyResp = await doOtpFlow(app, 'email', email);
      const authData = (await verifyResp.json()) as {
        refreshToken: string;
        accessToken: string;
      };

      const response = await app.handle(
        new Request('http://localhost:3000/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken: authData.refreshToken,
          }),
        })
      );
      expect(response.status).toBe(200);
      const data = (await response.json()) as {
        accessToken: string;
      };
      expect(data.accessToken).not.toBe(authData.accessToken);
    });

    it('should reject invalid token', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: 'invalid' }),
        })
      );
      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
      );
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });
    });
  });

  describe('GET /auth/me', () => {
    it('should return user', async () => {
      const app = createTestApp();
      const email = 'me-test@example.com';
      const verifyResp = await doOtpFlow(app, 'email', email);
      const authData = (await verifyResp.json()) as {
        accessToken: string;
      };

      const response = await app.handle(
        new Request('http://localhost:3000/auth/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${authData.accessToken}` },
        })
      );
      expect(response.status).toBe(200);
      const data = (await response.json()) as Record<string, unknown>;
      expect(data.email).toBe(email);
    });

    it('should reject unauthorized', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/me', { method: 'GET' })
      );
      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/apple', () => {
    it('returns 501', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/apple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: 'test' }),
        })
      );
      expect(response.status).toBe(501);
    });

    it('rejects missing token', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/auth/apple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
      );
      expect(response.status).toBe(400);
    });
  });
});

describe('OTP Utils', () => {
  describe('isValidEmail', () => {
    it('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });
    it('rejects invalid emails', () => {
      expect(isValidEmail('not-email')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('validates correct phones', () => {
      expect(isValidPhone('+1234567890')).toBe(true);
    });
    it('rejects invalid phones', () => {
      expect(isValidPhone('12345')).toBe(false);
    });
  });
});
