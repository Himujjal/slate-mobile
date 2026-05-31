import { useValue } from '@legendapp/state/react';
import { kv } from '../storage';
import type { AuthUser } from './auth-store';
import {
  authState$,
  clearAuth,
  setAuthError,
  setAuthLoading,
  setAuthTokens,
  setAuthUser,
} from './auth-store';

interface OtpRequestResponse {
  message: string;
  identifier: string;
  method: 'email' | 'mobile';
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchAuth<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

function handleAuthSuccess(response: AuthResponse) {
  setAuthTokens(response.accessToken, response.refreshToken);
  setAuthUser(response.user);
  kv.setString('auth_access_token', response.accessToken);
  kv.setString('auth_refresh_token', response.refreshToken);
  kv.setObject('auth_user', response.user);
}

export function useAuth() {
  const user = useValue(authState$.user) as AuthUser | null;
  const accessToken = useValue(authState$.accessToken) as string | null;
  const refreshToken = useValue(authState$.refreshToken) as string | null;
  const isAuthenticated = useValue(authState$.isAuthenticated) as boolean;
  const isLoading = useValue(authState$.isLoading) as boolean;
  const error = useValue(authState$.error) as string | null;

  const requestEmailOtp = async (email: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetchAuth<OtpRequestResponse>('otp/request', {
        method: 'email',
        email,
      });
      return response;
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'OTP request failed');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetchAuth<AuthResponse>('otp/verify', {
        method: 'email',
        email,
        otp,
      });
      handleAuthSuccess(response);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'OTP verification failed');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const requestMobileOtp = async (phone: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetchAuth<OtpRequestResponse>('otp/request', {
        method: 'mobile',
        phone,
      });
      return response;
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'OTP request failed');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyMobileOtp = async (phone: string, otp: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetchAuth<AuthResponse>('otp/verify', {
        method: 'mobile',
        phone,
        otp,
      });
      handleAuthSuccess(response);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'OTP verification failed');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithApple = async (_idToken: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetchAuth<AuthResponse>('apple', {
        idToken: _idToken,
      });
      handleAuthSuccess(response);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Apple sign in failed');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    const refreshTokenVal = authState$.refreshToken.peek();
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenVal }),
      });
    } catch {
      // Ignore network errors during logout
    } finally {
      kv.remove('auth_access_token');
      kv.remove('auth_refresh_token');
      kv.remove('auth_user');
      clearAuth();
    }
  };

  const refresh = async () => {
    const refreshTokenVal = authState$.refreshToken.peek();
    if (!refreshTokenVal) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenVal }),
      });
      if (response.ok) {
        const data = await response.json();
        setAuthTokens(data.accessToken, data.refreshToken);
        kv.setString('auth_access_token', data.accessToken);
        kv.setString('auth_refresh_token', data.refreshToken);
      } else {
        kv.remove('auth_access_token');
        kv.remove('auth_refresh_token');
        kv.remove('auth_user');
        clearAuth();
      }
    } catch {
      kv.remove('auth_access_token');
      kv.remove('auth_refresh_token');
      kv.remove('auth_user');
      clearAuth();
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
    requestEmailOtp,
    verifyEmailOtp,
    requestMobileOtp,
    verifyMobileOtp,
    loginWithApple,
    logout,
    refresh,
  };
}

export function useUser(): AuthUser | null {
  return useValue(authState$.user) as AuthUser | null;
}

export function useIsAuthenticated(): boolean {
  return useValue(authState$.isAuthenticated) as boolean;
}

export function useAuthLoading(): boolean {
  return useValue(authState$.isLoading) as boolean;
}

export function useAuthError(): string | null {
  return useValue(authState$.error) as string | null;
}

export function initializeAuthState() {
  return {
    setAuthTokens,
    setAuthUser,
    clearAuth,
    authState$,
  };
}
