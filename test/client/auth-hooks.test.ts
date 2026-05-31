import '../../happydom';
import { beforeEach, describe, expect, it } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import {
  useAuth,
  useAuthError,
  useAuthLoading,
  useIsAuthenticated,
  useUser,
} from '../../flux/auth-hooks';
import {
  authState$,
  clearAuth,
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

describe('auth hooks', () => {
  beforeEach(() => {
    clearAuth();
  });

  describe('useAuth', () => {
    it('should return default values when not authenticated', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toBeNull();
      expect(result.current.accessToken).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return auth values after setting tokens', () => {
      act(() => {
        setAuthTokens('access-123', 'refresh-456');
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.accessToken).toBe('access-123');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return user after setting user', () => {
      const user = makeUser();
      act(() => {
        setAuthUser(user);
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.user).toEqual(user);
    });

    it('should update isLoading', () => {
      act(() => {
        setAuthLoading(true);
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isLoading).toBe(true);
    });

    it('should update error', () => {
      act(() => {
        setAuthError('Something went wrong');
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.error).toBe('Something went wrong');
    });

    it('should reflect cleared state after logout', () => {
      const user = makeUser();
      act(() => {
        setAuthTokens('access', 'refresh');
        setAuthUser(user);
      });

      act(() => {
        clearAuth();
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.user).toBeNull();
      expect(result.current.accessToken).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('useUser', () => {
    it('should return null when not authenticated', () => {
      const { result } = renderHook(() => useUser());
      expect(result.current).toBeNull();
    });

    it('should return user when set', () => {
      const user = makeUser();
      act(() => {
        setAuthUser(user);
      });

      const { result } = renderHook(() => useUser());
      expect(result.current).toEqual(user);
    });
  });

  describe('useIsAuthenticated', () => {
    it('should return false when not authenticated', () => {
      const { result } = renderHook(() => useIsAuthenticated());
      expect(result.current).toBe(false);
    });

    it('should return true when authenticated', () => {
      act(() => {
        setAuthTokens('t', 'r');
      });

      const { result } = renderHook(() => useIsAuthenticated());
      expect(result.current).toBe(true);
    });

    it('should return false after clearing auth', () => {
      act(() => {
        setAuthTokens('t', 'r');
      });

      act(() => {
        clearAuth();
      });

      const { result } = renderHook(() => useIsAuthenticated());
      expect(result.current).toBe(false);
    });
  });

  describe('useAuthLoading', () => {
    it('should return false by default', () => {
      const { result } = renderHook(() => useAuthLoading());
      expect(result.current).toBe(false);
    });

    it('should return true when loading', () => {
      act(() => {
        setAuthLoading(true);
      });

      const { result } = renderHook(() => useAuthLoading());
      expect(result.current).toBe(true);
    });
  });

  describe('useAuthError', () => {
    it('should return null by default', () => {
      const { result } = renderHook(() => useAuthError());
      expect(result.current).toBeNull();
    });

    it('should return error string when set', () => {
      act(() => {
        setAuthError('error occurred');
      });

      const { result } = renderHook(() => useAuthError());
      expect(result.current).toBe('error occurred');
    });
  });

  describe('hook re-renders on state changes', () => {
    it('should update useUser when user changes', () => {
      const { result } = renderHook(() => useUser());
      expect(result.current).toBeNull();

      const user = makeUser();
      act(() => {
        setAuthUser(user);
      });

      expect(result.current).toEqual(user);

      act(() => {
        setAuthUser({ ...user, name: 'Updated Name' });
      });

      expect(result.current?.name).toBe('Updated Name');
    });

    it('should update useIsAuthenticated when tokens change', () => {
      const { result } = renderHook(() => useIsAuthenticated());
      expect(result.current).toBe(false);

      act(() => {
        setAuthTokens('access', 'refresh');
      });

      expect(result.current).toBe(true);

      act(() => {
        clearAuth();
      });

      expect(result.current).toBe(false);
    });
  });
});
