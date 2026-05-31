import { useValue } from '@legendapp/state/react';
import { api } from './api-client';
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

function handleAuthSuccess(response: AuthResponse) {
  setAuthTokens(response.accessToken, response.refreshToken);
  setAuthUser(response.user);
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
      const response = await api.post<OtpRequestResponse>(
        '/auth/otp/request',
        { method: 'email', email },
        { authenticated: false }
      );
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
      const response = await api.post<AuthResponse>(
        '/auth/otp/verify',
        { method: 'email', email, otp },
        { authenticated: false }
      );
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
      const response = await api.post<OtpRequestResponse>(
        '/auth/otp/request',
        { method: 'mobile', phone },
        { authenticated: false }
      );
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
      const response = await api.post<AuthResponse>(
        '/auth/otp/verify',
        { method: 'mobile', phone, otp },
        { authenticated: false }
      );
      handleAuthSuccess(response);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'OTP verification failed');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithApple = async (idToken: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await api.post<AuthResponse>(
        '/auth/apple',
        { idToken },
        { authenticated: false }
      );
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
      await api.post(
        '/auth/logout',
        { refreshToken: refreshTokenVal },
        { authenticated: false }
      );
    } catch {
      // Ignore network errors during logout
    } finally {
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
