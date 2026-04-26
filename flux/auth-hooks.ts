import type { Observable } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import {
  type AuthUser,
  authState$,
  clearAuth,
  setAuthError,
  setAuthLoading,
  setAuthTokens,
  setAuthUser,
} from './auth-store';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchAuth(
  endpoint: string,
  data: LoginCredentials | RegisterCredentials
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export function useAuth(): {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
} {
  const user = useValue(authState$.user) as AuthUser | null;
  const accessToken = useValue(authState$.accessToken) as string | null;
  const refreshToken = useValue(authState$.refreshToken) as string | null;
  const isAuthenticated = useValue(authState$.isAuthenticated) as boolean;
  const isLoading = useValue(authState$.isLoading) as boolean;
  const error = useValue(authState$.error) as string | null;

  const login = async (credentials: LoginCredentials) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetchAuth('login', credentials);
      setAuthTokens(response.token, response.refreshToken);
      setAuthUser(response.user);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Login failed');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetchAuth('register', credentials);
      setAuthTokens(response.token, response.refreshToken);
      setAuthUser(response.user);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Registration failed');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = authState$.refreshToken.peek();
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
    } finally {
      clearAuth();
    }
  };

  const refresh = async () => {
    const refreshToken = authState$.refreshToken.peek();
    if (!refreshToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        setAuthTokens(data.token, data.refreshToken);
      } else {
        clearAuth();
      }
    } catch {
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
    login,
    register,
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
