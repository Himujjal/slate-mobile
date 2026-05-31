import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { ApiError, api, apiClient } from '../../flux/api-client';
import { authState$, clearAuth } from '../../flux/auth-store';
import { MemoryKvAdapter, kv, setKvAdapter } from '../../storage';

type FetchMock = (
  url: string | URL | Request,
  options?: RequestInit
) => Promise<Response>;

function mockFetchHandler(
  handler: (url: string, options?: RequestInit) => Promise<Response>
) {
  globalThis.fetch = handler as unknown as typeof fetch;
}

describe('api-client', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
    clearAuth();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('apiClient', () => {
    it('should make a POST request with JSON body', async () => {
      let captured: { url: string; options: RequestInit } | undefined;
      mockFetchHandler(async (url: string, options?: RequestInit) => {
        captured = { url, options: options || {} };
        return {
          ok: true,
          status: 200,
          json: async () => ({ result: 'ok' }),
          headers: new Headers(),
        } as Response;
      });

      const result = await apiClient<{ result: string }>('/api/test', {
        method: 'POST',
        body: JSON.stringify({ data: 1 }),
        authenticated: false,
      });

      expect(captured?.url).toContain('/api/test');
      expect(captured?.options.method).toBe('POST');
      expect(result).toEqual({ result: 'ok' });
    });

    it('should attach Bearer token when authenticated', async () => {
      authState$.accessToken.set('my-token');

      let capturedHeaders: Record<string, string> | undefined;
      mockFetchHandler(async (_url: string, options?: RequestInit) => {
        capturedHeaders = options?.headers as Record<string, string>;
        return {
          ok: true,
          status: 200,
          json: async () => ({}),
          headers: new Headers(),
        } as Response;
      });

      await apiClient('/api/test', { authenticated: true });
      expect(capturedHeaders?.Authorization).toBe('Bearer my-token');
    });

    it('should throw ApiError on non-ok response', async () => {
      mockFetchHandler(async () => {
        return {
          ok: false,
          status: 400,
          json: async () => ({ error: 'Bad request', code: 'BAD_REQUEST' }),
          headers: new Headers(),
        } as Response;
      });

      try {
        await apiClient('/api/test', { authenticated: false });
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError);
        expect((e as ApiError).message).toBe('Bad request');
        expect((e as ApiError).status).toBe(400);
        expect((e as ApiError).code).toBe('BAD_REQUEST');
      }
    });

    it('should load token and user from storage when not in memory', async () => {
      kv.setString('auth_access_token', 'stored-token');
      kv.setObject('auth_user', {
        id: 'user-1',
        email: 'test@example.com',
        phone: null,
        name: 'Test',
        authProvider: 'email_otp',
        avatarUrl: null,
        createdAt: 1000,
        updatedAt: 1000,
      });

      let capturedToken: string | undefined;
      mockFetchHandler(async (_url: string, options?: RequestInit) => {
        const headers = options?.headers as Record<string, string>;
        capturedToken = headers?.Authorization?.replace('Bearer ', '');
        return {
          ok: true,
          status: 200,
          json: async () => ({}),
          headers: new Headers(),
        } as Response;
      });

      await apiClient('/api/test', { authenticated: true });
      expect(capturedToken).toBe('stored-token');
      expect(authState$.user.peek()?.id).toBe('user-1');
    });

    it('should try to refresh token on 401 and retry', async () => {
      clearAuth();
      kv.setString('auth_access_token', 'expired-token');
      kv.setString('auth_refresh_token', 'valid-refresh');

      let callCount = 0;
      mockFetchHandler(async (url: string) => {
        callCount++;
        if (url.includes('/auth/refresh')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              accessToken: 'new-access',
              refreshToken: 'new-refresh',
            }),
            headers: new Headers(),
          } as Response;
        }

        if (callCount === 1) {
          return {
            ok: false,
            status: 401,
            json: async () => ({ error: 'Unauthorized' }),
            headers: new Headers(),
          } as Response;
        }

        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
          headers: new Headers(),
        } as Response;
      });

      const result = await apiClient<{ success: boolean }>('/api/data');
      expect(result).toEqual({ success: true });
      expect(callCount).toBe(3);
      expect(kv.getString('auth_access_token')).toBe('new-access');
    });

    it('should throw NO_REFRESH_TOKEN when refresh fails', async () => {
      clearAuth();
      authState$.accessToken.set('expired-token');
      kv.remove('auth_refresh_token');

      mockFetchHandler(async (url: string) => {
        if (url.includes('/auth/refresh')) {
          return {
            ok: false,
            status: 401,
            json: async () => ({ error: 'No refresh token' }),
            headers: new Headers(),
          } as Response;
        }
        return {
          ok: false,
          status: 401,
          json: async () => ({ error: 'Unauthorized' }),
          headers: new Headers(),
        } as Response;
      });

      try {
        await apiClient('/api/data', { authenticated: true });
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError);
        expect((e as ApiError).code).toBe('NO_REFRESH_TOKEN');
      }
    });
  });

  describe('api helpers', () => {
    it('should expose api.get', () => {
      expect(typeof api.get).toBe('function');
    });

    it('should expose api.post', () => {
      expect(typeof api.post).toBe('function');
    });

    it('should expose api.put', () => {
      expect(typeof api.put).toBe('function');
    });

    it('should expose api.delete', () => {
      expect(typeof api.delete).toBe('function');
    });
  });
});
