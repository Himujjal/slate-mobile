import { beforeEach, describe, expect, it } from 'bun:test';
import { MemoryKvAdapter, setKvAdapter } from './kv';
import { type StoredUser, tokenStorage } from './token-storage';

describe('tokenStorage', () => {
  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
    tokenStorage.clearAll();
  });

  describe('saveTokens / getTokens', () => {
    it('should save and retrieve tokens', () => {
      tokenStorage.saveTokens('abc123', 'xyz789');
      const tokens = tokenStorage.getTokens();
      expect(tokens).toEqual({
        accessToken: 'abc123',
        refreshToken: 'xyz789',
      });
    });

    it('should return null when no tokens saved', () => {
      expect(tokenStorage.getTokens()).toBeNull();
    });

    it('should return null when only access token exists', () => {
      tokenStorage.saveTokens('abc123', '');
      expect(tokenStorage.getTokens()).toBeNull();
    });

    it('should overwrite existing tokens', () => {
      tokenStorage.saveTokens('old', 'old-refresh');
      tokenStorage.saveTokens('new', 'new-refresh');
      expect(tokenStorage.getTokens()).toEqual({
        accessToken: 'new',
        refreshToken: 'new-refresh',
      });
    });
  });

  describe('clearTokens', () => {
    it('should clear saved tokens', () => {
      tokenStorage.saveTokens('abc', 'xyz');
      tokenStorage.clearTokens();
      expect(tokenStorage.getTokens()).toBeNull();
    });

    it('should not throw when no tokens to clear', () => {
      expect(() => tokenStorage.clearTokens()).not.toThrow();
    });
  });

  describe('saveUser / getUser', () => {
    it('should save and retrieve user', () => {
      const user: StoredUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };
      tokenStorage.saveUser(user);
      expect(tokenStorage.getUser()).toEqual(user);
    });

    it('should return null when no user saved', () => {
      expect(tokenStorage.getUser()).toBeNull();
    });

    it('should overwrite existing user', () => {
      const user1: StoredUser = { id: '1', email: 'a@b.com', name: 'A' };
      const user2: StoredUser = { id: '2', email: 'c@d.com', name: 'B' };
      tokenStorage.saveUser(user1);
      tokenStorage.saveUser(user2);
      expect(tokenStorage.getUser()).toEqual(user2);
    });
  });

  describe('clearUser', () => {
    it('should clear saved user', () => {
      tokenStorage.saveUser({ id: '1', email: 'a@b.com', name: 'A' });
      tokenStorage.clearUser();
      expect(tokenStorage.getUser()).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should clear both tokens and user', () => {
      tokenStorage.saveTokens('abc', 'xyz');
      tokenStorage.saveUser({ id: '1', email: 'a@b.com', name: 'A' });
      tokenStorage.clearAll();
      expect(tokenStorage.getTokens()).toBeNull();
      expect(tokenStorage.getUser()).toBeNull();
    });
  });

  describe('hasStoredAuth', () => {
    it('should return true when both tokens and user exist', () => {
      tokenStorage.saveTokens('abc', 'xyz');
      tokenStorage.saveUser({ id: '1', email: 'a@b.com', name: 'A' });
      expect(tokenStorage.hasStoredAuth()).toBe(true);
    });

    it('should return false when no auth data', () => {
      expect(tokenStorage.hasStoredAuth()).toBe(false);
    });

    it('should return false when only tokens exist', () => {
      tokenStorage.saveTokens('abc', 'xyz');
      expect(tokenStorage.hasStoredAuth()).toBe(false);
    });

    it('should return false when only user exists', () => {
      tokenStorage.saveUser({ id: '1', email: 'a@b.com', name: 'A' });
      expect(tokenStorage.hasStoredAuth()).toBe(false);
    });
  });
});
