import { beforeEach, describe, expect, it } from 'bun:test';
import {
  MemoryKvAdapter,
  MemoryTableAdapter,
  kv,
  onboardingStorage,
  setKvAdapter,
  setTableAdapter,
  table,
  tokenStorage,
} from './index';

describe('storage index - barrel exports', () => {
  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
    setTableAdapter(new MemoryTableAdapter());
  });

  it('should export kv with all methods', () => {
    kv.setString('k', 'v');
    expect(kv.getString('k')).toBe('v');
  });

  it('should export tokenStorage', () => {
    tokenStorage.saveTokens('a', 'b');
    expect(tokenStorage.getTokens()).toEqual({
      accessToken: 'a',
      refreshToken: 'b',
    });
  });

  it('should export table with all methods', () => {
    table.insert('todos', { id: '1', title: 'test' });
    expect(table.findAll('todos')).toEqual([{ id: '1', title: 'test' }]);
  });

  it('should export onboardingStorage', () => {
    expect(onboardingStorage.hasOnboarded()).toBe(false);
    onboardingStorage.completeOnboarding();
    expect(onboardingStorage.hasOnboarded()).toBe(true);
  });

  it('should export adapter management functions', () => {
    expect(typeof setKvAdapter).toBe('function');
    expect(typeof setTableAdapter).toBe('function');
    expect(typeof MemoryKvAdapter).toBe('function');
    expect(typeof MemoryTableAdapter).toBe('function');
  });
});
