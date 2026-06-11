import { describe, expect, it } from 'bun:test';
import { createSyncedStore, createSyncedValue } from '../../flux/sync';

function triggerSync<T>(store$: { get: () => T }): T {
  return store$.get();
}

describe('createSyncedStore subscribe option', () => {
  it('should accept subscribe function in config', () => {
    const subscribe = () => undefined;
    const store$ = createSyncedStore({
      initial: [],
      name: 'subscribe-store',
      fetch: async () => [],
      subscribe,
    });
    expect(store$).toBeDefined();
  });

  it('should call subscribe when sync is activated', () => {
    let subscribeCalled = false;
    const store$ = createSyncedStore({
      initial: [],
      name: 'subscribe-called',
      fetch: async () => [],
      subscribe: () => {
        subscribeCalled = true;
        return undefined;
      },
    });
    triggerSync(store$);
    expect(subscribeCalled).toBe(true);
  });

  it('should accept subscribe returning undefined', () => {
    const store$ = createSyncedStore({
      initial: [],
      name: 'subscribe-undef',
      fetch: async () => [],
      subscribe: () => undefined,
    });
    expect(store$).toBeDefined();
  });

  it('should pass params with update, lastSync, refresh, onError, value$', () => {
    const received: Record<string, unknown> = {};
    const store$ = createSyncedStore({
      initial: [],
      name: 'subscribe-params',
      fetch: async () => [],
      subscribe: (params) => {
        received.hasUpdate = typeof params.update === 'function';
        received.hasRefresh = typeof params.refresh === 'function';
        received.hasOnError = typeof params.onError === 'function';
        received.hasValue$ = params.value$ !== undefined;
        received.lastSync = params.lastSync;
        return undefined;
      },
    });
    triggerSync(store$);
    expect(received.hasUpdate).toBe(true);
    expect(received.hasRefresh).toBe(true);
    expect(received.hasOnError).toBe(true);
    expect(received.hasValue$).toBe(true);
    expect(received.lastSync).toBeUndefined();
  });
});

describe('createSyncedValue subscribe option', () => {
  it('should accept subscribe function in config', () => {
    const store$ = createSyncedValue({
      initial: { count: 0 },
      name: 'value-sub',
      fetch: async () => ({ count: 0 }),
      subscribe: () => undefined,
    });
    expect(store$).toBeDefined();
  });

  it('should call subscribe when sync is activated', () => {
    let subscribeCalled = false;
    const store$ = createSyncedValue({
      initial: { count: 0 },
      name: 'value-sub-called',
      fetch: async () => ({ count: 0 }),
      subscribe: () => {
        subscribeCalled = true;
        return undefined;
      },
    });
    triggerSync(store$);
    expect(subscribeCalled).toBe(true);
  });
});
