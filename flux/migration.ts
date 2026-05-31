import { kv } from '../storage';
import type { AuthStateData, AuthUser } from './auth-store';

const OLD_ACCESS_TOKEN_KEY = 'auth_access_token';
const OLD_REFRESH_TOKEN_KEY = 'auth_refresh_token';
const OLD_USER_KEY = 'auth_user';
const MIGRATION_DONE_KEY = 'auth_migration_done';

export function migrateAuthKeys(): void {
  const alreadyMigrated = kv.getBoolean(MIGRATION_DONE_KEY);
  if (alreadyMigrated) {
    return;
  }

  const oldAccessToken = kv.getString(OLD_ACCESS_TOKEN_KEY);
  const oldRefreshToken = kv.getString(OLD_REFRESH_TOKEN_KEY);
  const oldUser = kv.getObject<AuthUser | null>(OLD_USER_KEY);

  const hasOldKeys =
    oldAccessToken !== undefined ||
    oldRefreshToken !== undefined ||
    oldUser !== undefined;

  if (hasOldKeys) {
    const newAuthData: AuthStateData = {
      user: oldUser?.id ? oldUser : null,
      accessToken: oldAccessToken ?? null,
      refreshToken: oldRefreshToken ?? null,
      isAuthenticated: !!(oldAccessToken && oldUser?.id),
      isLoading: false,
      error: null,
    };

    kv.setObject('auth', newAuthData);
  }

  kv.remove(OLD_ACCESS_TOKEN_KEY);
  kv.remove(OLD_REFRESH_TOKEN_KEY);
  kv.remove(OLD_USER_KEY);

  kv.setBoolean(MIGRATION_DONE_KEY, true);
}
