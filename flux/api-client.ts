import { kv } from '../storage';
import {
  authState$,
  clearAuth,
  setAuthTokens,
  setAuthUser,
} from './auth-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  authenticated?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshToken(): Promise<void> {
  if (isRefreshing) {
    await refreshPromise;
    return;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    const storedAccessToken = kv.getString('auth_access_token');
    const storedRefreshToken = kv.getString('auth_refresh_token');
    if (!storedAccessToken || !storedRefreshToken) {
      clearAuth();
      throw new ApiError('No refresh token', 401, 'NO_REFRESH_TOKEN');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        kv.remove('auth_access_token');
        kv.remove('auth_refresh_token');
        kv.remove('auth_user');
        clearAuth();
        throw new ApiError('Refresh failed', 401, 'REFRESH_FAILED');
      }

      const data = await response.json();
      kv.setString('auth_access_token', data.accessToken);
      kv.setString('auth_refresh_token', data.refreshToken);
      setAuthTokens(data.accessToken, data.refreshToken);
    } catch {
      kv.remove('auth_access_token');
      kv.remove('auth_refresh_token');
      kv.remove('auth_user');
      clearAuth();
      throw new ApiError('Refresh failed', 401, 'REFRESH_FAILED');
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  await refreshPromise;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { authenticated = true, ...fetchOptions } = options;

  let accessToken = authState$.accessToken.peek();

  const makeRequest = async (token: string | null): Promise<T> => {
    const headers: Record<string, string> = {};

    if (fetchOptions.headers) {
      const existingHeaders = fetchOptions.headers as Record<string, string>;
      Object.assign(headers, existingHeaders);
    }

    if (token && authenticated) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (response.status === 401 && authenticated && token) {
      if (accessToken === token) {
        await refreshToken();
        accessToken = authState$.accessToken.peek();
        return makeRequest(accessToken);
      }
    }

    if (!response.ok) {
      let message = 'Request failed';
      let code = 'REQUEST_FAILED';
      try {
        const error = await response.json();
        message = error.error || message;
        code = error.code || code;
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiError(message, response.status, code);
    }

    return response.json();
  };

  if (authenticated && !accessToken) {
    const storedAccessToken = kv.getString('auth_access_token');
    if (storedAccessToken) {
      accessToken = storedAccessToken;
      const storedUser = kv.getObject<{
        id: string;
        email: string;
        name: string;
      }>('auth_user');
      if (storedUser) {
        setAuthUser(storedUser);
      }
    }
  }

  return makeRequest(accessToken);
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: { ...options?.headers, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: { ...options?.headers, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
