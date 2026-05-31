import { createKvStore } from './state';

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  authProvider: string;
  avatarUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface AuthStateData {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthStateData = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authState$ = createKvStore<AuthStateData>({
  initial: initialState,
  name: 'auth',
});

export function setAuthTokens(accessToken: string, refreshToken: string) {
  authState$.accessToken.set(accessToken);
  authState$.refreshToken.set(refreshToken);
  authState$.isAuthenticated.set(true);
}

export function setAuthUser(user: AuthUser) {
  authState$.user.set(user);
}

export function setAuthLoading(isLoading: boolean) {
  authState$.isLoading.set(isLoading);
}

export function setAuthError(error: string | null) {
  authState$.error.set(error);
}

export function clearAuth() {
  authState$.user.set(null);
  authState$.accessToken.set(null);
  authState$.refreshToken.set(null);
  authState$.isAuthenticated.set(false);
  authState$.isLoading.set(false);
  authState$.error.set(null);
}
