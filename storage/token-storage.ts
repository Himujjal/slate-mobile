import type { AuthUser } from '../flux/auth-store';
import { kv } from './kv';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

export const tokenStorage = {
  saveTokens(accessToken: string, refreshToken: string): void {
    kv.setString(ACCESS_TOKEN_KEY, accessToken);
    kv.setString(REFRESH_TOKEN_KEY, refreshToken);
  },

  getTokens(): { accessToken: string; refreshToken: string } | null {
    const accessToken = kv.getString(ACCESS_TOKEN_KEY);
    const refreshToken = kv.getString(REFRESH_TOKEN_KEY);
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  },

  clearTokens(): void {
    kv.remove(ACCESS_TOKEN_KEY);
    kv.remove(REFRESH_TOKEN_KEY);
  },

  saveUser(user: AuthUser): void {
    kv.setObject(USER_KEY, user);
  },

  getUser(): AuthUser | null {
    return kv.getObject<AuthUser>(USER_KEY) ?? null;
  },

  clearUser(): void {
    kv.remove(USER_KEY);
  },

  clearAll(): void {
    this.clearTokens();
    this.clearUser();
  },

  hasStoredAuth(): boolean {
    const tokens = this.getTokens();
    const user = this.getUser();
    return !!tokens && !!user;
  },
};

export type TokenStorage = typeof tokenStorage;
