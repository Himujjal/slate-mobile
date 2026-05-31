import { beforeEach, describe, expect, it } from 'bun:test';
import type { AuthUser } from '../../flux/auth-store';
import { migrateAuthKeys } from '../../flux/migration';
import { MemoryKvAdapter, kv, setKvAdapter } from '../../storage';

function setOldKeys(overrides: {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser | null;
}) {
  if (overrides.accessToken !== undefined) {
    kv.setString('auth_access_token', overrides.accessToken);
  }
  if (overrides.refreshToken !== undefined) {
    kv.setString('auth_refresh_token', overrides.refreshToken);
  }
  if (overrides.user !== undefined) {
    kv.setObject('auth_user', overrides.user);
  }
}

function makeUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'user-1',
    email: 'test@example.com',
    phone: null,
    name: 'Test User',
    authProvider: 'email_otp',
    avatarUrl: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe('migrateAuthKeys', () => {
  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
  });

  it('should migrate all 3 old keys to single auth key', () => {
    const user = makeUser();
    setOldKeys({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
      user,
    });

    migrateAuthKeys();

    const auth = kv.getObject<{
      accessToken: string;
      refreshToken: string;
      user: AuthUser;
      isAuthenticated: boolean;
    }>('auth');

    expect(auth?.accessToken).toBe('access-123');
    expect(auth?.refreshToken).toBe('refresh-456');
    expect(auth?.user).toEqual(user);
    expect(auth?.isAuthenticated).toBe(true);
  });

  it('should remove old keys after migration', () => {
    setOldKeys({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
      user: makeUser(),
    });

    migrateAuthKeys();

    expect(kv.contains('auth_access_token')).toBe(false);
    expect(kv.contains('auth_refresh_token')).toBe(false);
    expect(kv.contains('auth_user')).toBe(false);
  });

  it('should handle partial keys (only tokens, no user)', () => {
    setOldKeys({
      accessToken: 'access-only',
      refreshToken: 'refresh-only',
      user: undefined,
    });

    migrateAuthKeys();

    const auth = kv.getObject<{
      accessToken: string;
      user: null;
      isAuthenticated: boolean;
    }>('auth');
    expect(auth?.accessToken).toBe('access-only');
    expect(auth?.user).toBeNull();
    expect(auth?.isAuthenticated).toBe(false);
  });

  it('should handle only user key present', () => {
    const user = makeUser();
    setOldKeys({
      accessToken: undefined,
      refreshToken: undefined,
      user,
    });

    migrateAuthKeys();

    const auth = kv.getObject<{
      accessToken: null;
      user: AuthUser;
      isAuthenticated: boolean;
    }>('auth');
    expect(auth?.user).toEqual(user);
    expect(auth?.accessToken).toBeNull();
    expect(auth?.isAuthenticated).toBe(false);
  });

  it('should handle auth_user being null', () => {
    setOldKeys({
      accessToken: 'token',
      refreshToken: 'refresh',
      user: null,
    });

    migrateAuthKeys();

    const auth = kv.getObject<{
      user: null;
      accessToken: string;
      isAuthenticated: boolean;
    }>('auth');
    expect(auth?.user).toBeNull();
    expect(auth?.accessToken).toBe('token');
    expect(auth?.isAuthenticated).toBe(false);
  });

  it('should handle auth_user being null', () => {
    setOldKeys({
      accessToken: 'token',
      refreshToken: 'refresh',
      user: null,
    });

    migrateAuthKeys();

    const auth = kv.getObject<{
      user: null;
      accessToken: string;
      isAuthenticated: boolean;
    }>('auth');
    expect(auth?.user).toBeNull();
    expect(auth?.accessToken).toBe('token');
    expect(auth?.isAuthenticated).toBe(false);
  });

  it('should handle auth_user with missing id', () => {
    const userWithoutId = { name: 'No ID' } as unknown as AuthUser;
    setOldKeys({
      accessToken: 'token',
      refreshToken: 'refresh',
      user: userWithoutId,
    });

    migrateAuthKeys();

    const auth = kv.getObject<{
      user: null;
      accessToken: string;
      isAuthenticated: boolean;
    }>('auth');
    expect(auth?.user).toBeNull();
    expect(auth?.isAuthenticated).toBe(false);
  });

  it('should be a no-op when no old keys exist', () => {
    migrateAuthKeys();

    expect(kv.contains('auth')).toBe(false);
  });

  it('should set migration done flag', () => {
    setOldKeys({
      accessToken: 'token',
      refreshToken: 'refresh',
      user: makeUser(),
    });

    migrateAuthKeys();

    expect(kv.getBoolean('auth_migration_done')).toBe(true);
  });

  it('should set migration done flag even with no old keys', () => {
    migrateAuthKeys();

    expect(kv.getBoolean('auth_migration_done')).toBe(true);
  });

  it('should be idempotent - second call does nothing', () => {
    const user = makeUser();
    setOldKeys({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
      user,
    });

    migrateAuthKeys();
    migrateAuthKeys();

    const auth = kv.getObject<{ accessToken: string }>('auth');
    expect(auth?.accessToken).toBe('access-123');
  });
});
