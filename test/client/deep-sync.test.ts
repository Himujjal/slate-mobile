import { describe, expect, it } from 'bun:test';
import { createSyncedStore, createSyncedValue } from '../../flux/sync';

interface TestItem {
  id: string;
  name?: string;
  count?: number;
}

interface TestValue {
  name: string;
  count: number;
}

describe('Deep sync lifecycle — createSyncedValue', () => {
  it('should accept fetch that returns null', () => {
    const store$ = createSyncedValue<TestValue>({
      initial: { name: '', count: 0 },
      name: 'lifecycle-null',
      fetch: async () => null,
    });
    expect(store$).toBeDefined();
  });

  it('should accept fetch that returns data', () => {
    const store$ = createSyncedValue<TestValue>({
      initial: { name: '', count: 0 },
      name: 'lifecycle-data',
      fetch: async () => ({ name: 'hello', count: 42 }),
    });
    expect(store$).toBeDefined();
  });

  it('should accept create function', () => {
    const store$ = createSyncedValue<TestValue>({
      initial: { name: '', count: 0 },
      name: 'lifecycle-create',
      fetch: async () => null,
      create: async (item) => item,
    });
    expect(store$).toBeDefined();
  });

  it('should accept update function', () => {
    const store$ = createSyncedValue<TestValue>({
      initial: { name: '', count: 0 },
      name: 'lifecycle-update',
      fetch: async () => ({ name: 'test', count: 0 }),
      update: async (changes) => changes as TestValue,
    });
    expect(store$).toBeDefined();
  });

  it('should accept delete function', () => {
    const store$ = createSyncedValue<TestValue>({
      initial: { name: '', count: 0 },
      name: 'lifecycle-delete',
      fetch: async () => ({ name: 'test', count: 0 }),
      delete: async () => {},
    });
    expect(store$).toBeDefined();
  });

  it('should support full CRUD lifecycle config', () => {
    const store$ = createSyncedValue<TestValue>({
      initial: { name: '', count: 0 },
      name: 'lifecycle-full',
      fetch: async () => ({ name: 'value', count: 1 }),
      create: async (item) => item,
      update: async (changes) => changes as TestValue,
      delete: async () => {},
      retry: { times: 3, delay: 1000, backoff: 'exponential' },
      onError: () => {},
      retrySync: true,
    });
    expect(store$).toBeDefined();
  });
});

describe('Deep sync lifecycle — createSyncedStore', () => {
  it('should accept fetch that returns empty array', () => {
    const store$ = createSyncedStore<TestItem>({
      initial: [],
      name: 'lifecycle-arr-empty',
      fetch: async () => [],
    });
    expect(store$).toBeDefined();
  });

  it('should accept create function', () => {
    const store$ = createSyncedStore<TestItem>({
      initial: [],
      name: 'lifecycle-arr-create',
      fetch: async () => [],
      create: async (item) => item,
    });
    expect(store$).toBeDefined();
  });

  it('should accept update function', () => {
    const store$ = createSyncedStore<TestItem>({
      initial: [],
      name: 'lifecycle-arr-update',
      fetch: async () => [],
      update: async (id, changes) => ({ id: id as string, ...changes }),
    });
    expect(store$).toBeDefined();
  });

  it('should accept delete function', () => {
    const store$ = createSyncedStore<TestItem>({
      initial: [],
      name: 'lifecycle-arr-delete',
      fetch: async () => [],
      delete: async () => {},
    });
    expect(store$).toBeDefined();
  });

  it('should support full CRUD lifecycle config', () => {
    const store$ = createSyncedStore<TestItem>({
      initial: [],
      name: 'lifecycle-arr-full',
      fetch: async () => [{ id: '1' }],
      create: async (item) => item,
      update: async (id, changes) => ({ id: id as string, ...changes }),
      delete: async () => {},
      retry: { times: 3, delay: 1000, backoff: 'exponential' },
      onError: () => {},
      retrySync: true,
    });
    expect(store$).toBeDefined();
  });
});
