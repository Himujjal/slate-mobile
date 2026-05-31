import { beforeEach, describe, expect, it } from 'bun:test';
import {
  authState$,
  clearAuth,
  initializeAuth,
  setAuthError,
  setAuthLoading,
  setAuthTokens,
  setAuthUser,
} from '../../flux/auth-store';
import type { AuthUser } from '../../flux/auth-store';

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

describe('auth-store', () => {
  beforeEach(() => {
    clearAuth();
  });

  describe('setAuthTokens', () => {
    it('should set tokens and mark as authenticated', () => {
      setAuthTokens('access-123', 'refresh-456');
      expect(authState$.accessToken.peek()).toBe('access-123');
      expect(authState$.refreshToken.peek()).toBe('refresh-456');
      expect(authState$.isAuthenticated.peek()).toBe(true);
    });
  });

  describe('setAuthUser', () => {
    it('should set user', () => {
      const user = makeUser();
      setAuthUser(user);
      const stored = authState$.user.peek();
      expect(stored).toEqual(user);
    });
  });

  describe('setAuthLoading', () => {
    it('should set loading state', () => {
      setAuthLoading(true);
      expect(authState$.isLoading.peek()).toBe(true);
      setAuthLoading(false);
      expect(authState$.isLoading.peek()).toBe(false);
    });
  });

  describe('setAuthError', () => {
    it('should set and clear error', () => {
      setAuthError('Something went wrong');
      expect(authState$.error.peek()).toBe('Something went wrong');
      setAuthError(null);
      expect(authState$.error.peek()).toBeNull();
    });
  });

  describe('clearAuth', () => {
    it('should reset all auth state', () => {
      setAuthTokens('access', 'refresh');
      setAuthUser(makeUser());
      setAuthError('some error');

      clearAuth();

      expect(authState$.user.peek()).toBeNull();
      expect(authState$.accessToken.peek()).toBeNull();
      expect(authState$.refreshToken.peek()).toBeNull();
      expect(authState$.isAuthenticated.peek()).toBe(false);
      expect(authState$.error.peek()).toBeNull();
    });
  });

  describe('initializeAuth', () => {
    it('should initialize with tokens and user', () => {
      const user = makeUser();
      initializeAuth('access-init', 'refresh-init', user);

      expect(authState$.accessToken.peek()).toBe('access-init');
      expect(authState$.refreshToken.peek()).toBe('refresh-init');
      expect(authState$.user.peek()).toEqual(user);
      expect(authState$.isAuthenticated.peek()).toBe(true);
    });

    it('should set not authenticated when tokens are null', () => {
      initializeAuth(null, null, null);
      expect(authState$.isAuthenticated.peek()).toBe(false);
    });

    it('should set not authenticated when user is null', () => {
      initializeAuth('token', 'refresh', null);
      expect(authState$.isAuthenticated.peek()).toBe(false);
    });
  });

  describe('AuthUser type', () => {
    it('should support email_otp user', () => {
      const user = makeUser({ authProvider: 'email_otp' });
      setAuthUser(user);
      const stored = authState$.user.peek();
      expect(stored?.authProvider).toBe('email_otp');
      expect(stored?.email).toBe('test@example.com');
    });

    it('should support mobile_otp user', () => {
      const user = makeUser({
        authProvider: 'mobile_otp',
        email: null,
        phone: '+1234567890',
      });
      setAuthUser(user);
      const stored = authState$.user.peek();
      expect(stored?.authProvider).toBe('mobile_otp');
      expect(stored?.email).toBeNull();
      expect(stored?.phone).toBe('+1234567890');
    });
  });
});
