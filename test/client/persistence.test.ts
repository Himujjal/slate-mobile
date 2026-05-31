import { beforeEach, describe, expect, it } from 'bun:test';
import type { Change } from '@legendapp/state';
import { ObservablePersistFlux } from '../../flux/persistence';
import { MemoryKvAdapter, kv, setKvAdapter } from '../../storage';

describe('ObservablePersistFlux', () => {
  let plugin: ObservablePersistFlux;

  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
    plugin = new ObservablePersistFlux();
  });

  describe('getTable', () => {
    it('should return init value when nothing is cached or stored', () => {
      const result = plugin.getTable('test', { default: true }, {} as any);
      expect(result).toEqual({ default: true });
    });

    it('should return cached KV value on subsequent calls', () => {
      kv.setObject('test', { name: 'cached' });
      plugin.getTable('test', { default: true }, {} as any);

      kv.remove('test');
      const result = plugin.getTable('test', { other: true }, {} as any);
      expect(result).toEqual({ name: 'cached' });
    });

    it('should hydrate from KV store when no cache exists', () => {
      kv.setObject('stored', { name: 'from-kv' });

      const result = plugin.getTable('stored', { default: true }, {} as any);
      expect(result).toEqual({ name: 'from-kv' });
    });
  });

  describe('set', () => {
    it('should merge changes into existing value', () => {
      plugin.getTable('items', { items: [] }, {} as any);

      const change: Change = {
        path: ['items'],
        pathTypes: ['array'],
        valueAtPath: [{ id: 1, text: 'todo' }],
        prevAtPath: [],
      };
      plugin.set('items', [change], {} as any);

      const result = plugin.getTable('items', {}, {} as any);
      expect(result).toEqual({ items: [{ id: 1, text: 'todo' }] });
    });

    it('should write merged value to KV', () => {
      kv.setObject('profile', { name: 'old' });

      const change: Change = {
        path: ['name'],
        pathTypes: ['object'],
        valueAtPath: 'new',
        prevAtPath: 'old',
      };
      plugin.set('profile', [change], {} as any);

      const stored = kv.getObject<{ name: string }>('profile');
      expect(stored?.name).toBe('new');
    });
  });

  describe('deleteTable', () => {
    it('should remove value from cache and KV', () => {
      kv.setObject('temp', { value: 1 });
      plugin.getTable('temp', {}, {} as any);

      plugin.deleteTable('temp', {} as any);

      expect(kv.getObject('temp')).toBeUndefined();
      const result = plugin.getTable('temp', { fallback: true }, {} as any);
      expect(result).toEqual({ fallback: true });
    });
  });

  describe('metadata', () => {
    it('should return empty object when no metadata stored', () => {
      const meta = plugin.getMetadata('test', {} as any);
      expect(meta).toEqual({});
    });

    it('should set and get metadata', () => {
      plugin.setMetadata('test', { version: 1 } as any, {} as any);

      const meta = plugin.getMetadata('test', {} as any);
      expect(meta).toEqual({ version: 1 } as any);
    });

    it('should store metadata under table__m key', () => {
      plugin.setMetadata('users', { count: 5 } as any, {} as any);

      const stored = kv.getObject('users__m');
      expect(stored).toEqual({ count: 5 });
    });
  });

  describe('initialize', () => {
    it('should be a no-op with no side effects', () => {
      expect(() => plugin.initialize({} as any)).not.toThrow();

      expect(kv.getAllKeys()).toEqual([]);
    });
  });
});
