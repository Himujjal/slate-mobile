import { describe, expect, it } from 'bun:test';
import { createSyncedStore, createSyncedValue } from '../../flux/sync';
import { MemoryKvAdapter, kv, setKvAdapter } from '../../storage';

describe('createSyncedStore', () => {
  it('should create a store without throwing', () => {
    expect(() =>
      createSyncedStore({
        initial: [],
        name: 'sync-items',
        fetch: async () => [],
      })
    ).not.toThrow();
  });

  it('should accept retry, onError and retrySync config', () => {
    const store$ = createSyncedStore({
      initial: [],
      name: 'sync-full-config',
      fetch: async () => [],
      retry: { times: 5, delay: 500, backoff: 'constant' },
      onError: () => {},
      retrySync: true,
    });

    expect(store$).toBeDefined();
  });
});

describe('createSyncedValue', () => {
  it('should create a value store without throwing', () => {
    expect(() =>
      createSyncedValue({
        initial: { name: '', count: 0 },
        name: 'sync-value',
        fetch: async () => ({ name: '', count: 0 }),
      })
    ).not.toThrow();
  });

  it('should accept retry, onError and retrySync config', () => {
    const store$ = createSyncedValue({
      initial: { name: 'test', count: 0 },
      name: 'value-full-config',
      fetch: async () => ({ name: 'test', count: 0 }),
      retry: { times: 3, delay: 1000, backoff: 'exponential' },
      onError: () => {},
      retrySync: true,
    });

    expect(store$).toBeDefined();
  });
});
