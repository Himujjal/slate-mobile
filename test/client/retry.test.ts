import { describe, expect, it } from 'bun:test';
import { createSyncedStore, createSyncedValue } from '../../flux/sync';

describe('Retry config for createSyncedStore', () => {
  it('should accept custom retry options', () => {
    const store$ = createSyncedStore({
      initial: [],
      name: 'retry-store',
      fetch: async () => [],
      retry: {
        times: 5,
        delay: 2000,
        backoff: 'constant',
        maxDelay: 10000,
      },
    });
    expect(store$).toBeDefined();
  });

  it('should accept exponential backoff retry', () => {
    const store$ = createSyncedStore({
      initial: [],
      name: 'retry-exp',
      fetch: async () => [],
      retry: {
        times: 3,
        delay: 500,
        backoff: 'exponential',
        maxDelay: 30000,
      },
    });
    expect(store$).toBeDefined();
  });

  it('should accept onError callback', () => {
    const onError = (error: Error) => {
      console.error(error.message);
    };
    const store$ = createSyncedStore({
      initial: [],
      name: 'retry-onerror',
      fetch: async () => [],
      onError,
    });
    expect(store$).toBeDefined();
  });

  it('should accept onError with full CrudErrorParams', () => {
    let errorReceived: { error: Error } | null = null;
    const store$ = createSyncedStore({
      initial: [],
      name: 'retry-onerror-params',
      fetch: async () => [],
      onError: (error) => {
        errorReceived = { error };
      },
    });
    expect(store$).toBeDefined();
    expect(errorReceived).toBeNull();
  });

  it('should accept retrySync option for offline queuing', () => {
    const store$ = createSyncedStore({
      initial: [],
      name: 'retry-offline',
      fetch: async () => [],
      retrySync: true,
    });
    expect(store$).toBeDefined();
  });

  it('should accept combined retry config', () => {
    const store$ = createSyncedStore({
      initial: [],
      name: 'retry-combined',
      fetch: async () => [],
      retry: {
        times: 5,
        delay: 500,
        backoff: 'exponential',
        maxDelay: 15000,
      },
      onError: () => {},
      retrySync: true,
    });
    expect(store$).toBeDefined();
  });
});

describe('Retry config for createSyncedValue', () => {
  it('should accept combined retry config', () => {
    const store$ = createSyncedValue({
      initial: { name: 'test', count: 0 },
      name: 'retry-val',
      fetch: async () => ({ name: 'test', count: 0 }),
      retry: { times: 2, delay: 100, backoff: 'constant' },
      onError: () => {},
      retrySync: true,
    });
    expect(store$).toBeDefined();
  });
});
