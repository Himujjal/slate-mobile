import '../happydom';
import { beforeEach, describe, expect, it } from 'bun:test';
import { kv, resetKvAdapter } from './kv';
import { MemoryTableAdapter, setTableAdapter, table } from './table';

describe('browser environment (happy-dom)', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  describe('kv - platform detection', () => {
    beforeEach(() => {
      resetKvAdapter();
    });

    it('should use localStorage adapter when localStorage is available', () => {
      kv.setString('key', 'browser-value');
      expect(globalThis.localStorage.getItem('key')).toBe('browser-value');
    });

    it('should persist data across adapter resets', () => {
      globalThis.localStorage.setItem('persist-key', 'persist-value');
      resetKvAdapter();
      expect(kv.getString('persist-key')).toBe('persist-value');
    });
  });

  describe('kv - string operations via localStorage', () => {
    beforeEach(() => {
      resetKvAdapter();
    });

    it('should set and get a string', () => {
      kv.setString('key1', 'hello');
      expect(kv.getString('key1')).toBe('hello');
    });

    it('should return undefined for missing key', () => {
      expect(kv.getString('nonexistent')).toBeUndefined();
    });

    it('should overwrite existing string', () => {
      kv.setString('key1', 'first');
      kv.setString('key1', 'second');
      expect(kv.getString('key1')).toBe('second');
    });
  });

  describe('kv - number operations via localStorage', () => {
    beforeEach(() => {
      resetKvAdapter();
    });

    it('should set and get a number', () => {
      kv.setNumber('count', 42);
      expect(kv.getNumber('count')).toBe(42);
    });

    it('should return undefined for missing number', () => {
      expect(kv.getNumber('nonexistent')).toBeUndefined();
    });

    it('should handle zero and negative numbers', () => {
      kv.setNumber('zero', 0);
      kv.setNumber('neg', -123);
      expect(kv.getNumber('zero')).toBe(0);
      expect(kv.getNumber('neg')).toBe(-123);
    });

    it('should handle floating point numbers', () => {
      kv.setNumber('pi', 3.14);
      expect(kv.getNumber('pi')).toBe(3.14);
    });
  });

  describe('kv - boolean operations via localStorage', () => {
    beforeEach(() => {
      resetKvAdapter();
    });

    it('should set and get true', () => {
      kv.setBoolean('flag', true);
      expect(kv.getBoolean('flag')).toBe(true);
    });

    it('should set and get false', () => {
      kv.setBoolean('flag', false);
      expect(kv.getBoolean('flag')).toBe(false);
    });

    it('should return undefined for missing boolean', () => {
      expect(kv.getBoolean('nonexistent')).toBeUndefined();
    });
  });

  describe('kv - object operations via localStorage', () => {
    beforeEach(() => {
      resetKvAdapter();
    });

    it('should set and get an object', () => {
      const obj = { name: 'test', count: 42 };
      kv.setObject('data', obj);
      const result = kv.getObject<{ name: string; count: number }>('data');
      expect(result).toEqual(obj);
    });

    it('should return undefined for missing object', () => {
      const result = kv.getObject('nonexistent');
      expect(result).toBeUndefined();
    });

    it('should handle null values', () => {
      kv.setObject('nullable', null);
      const result = kv.getObject<null>('nullable');
      expect(result).toBeNull();
    });

    it('should handle arrays', () => {
      const arr = [1, 'two', { three: 3 }];
      kv.setObject('arr', arr);
      const result =
        kv.getObject<(string | number | { three: number })[]>('arr');
      expect(result).toEqual(arr);
    });
  });

  describe('kv - remove/clear via localStorage', () => {
    beforeEach(() => {
      resetKvAdapter();
    });

    it('should remove a key', () => {
      kv.setString('key1', 'value');
      kv.remove('key1');
      expect(kv.getString('key1')).toBeUndefined();
      expect(globalThis.localStorage.getItem('key1')).toBeNull();
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => kv.remove('nonexistent')).not.toThrow();
    });

    it('should clear all keys', () => {
      kv.setString('key1', 'value1');
      kv.setString('key2', 'value2');
      kv.clear();
      expect(kv.getAllKeys()).toEqual([]);
      expect(globalThis.localStorage.length).toBe(0);
    });
  });

  describe('kv - getAllKeys via localStorage', () => {
    beforeEach(() => {
      resetKvAdapter();
    });

    it('should return all keys', () => {
      kv.setString('a', '1');
      kv.setString('b', '2');
      kv.setString('c', '3');
      expect(kv.getAllKeys()).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array when no keys', () => {
      expect(kv.getAllKeys()).toEqual([]);
    });
  });

  describe('kv - contains via localStorage', () => {
    beforeEach(() => {
      resetKvAdapter();
    });

    it('should return true for existing key', () => {
      kv.setString('key1', 'value');
      expect(kv.contains('key1')).toBe(true);
    });

    it('should return false for missing key', () => {
      expect(kv.contains('nonexistent')).toBe(false);
    });
  });

  describe('table - MemoryTableAdapter', () => {
    beforeEach(() => {
      setTableAdapter(new MemoryTableAdapter());
    });

    it('should insert and find records', () => {
      table.insert('items', { id: '1', name: 'a', value: 1 });
      expect(table.find('items', '1')).toEqual({
        id: '1',
        name: 'a',
        value: 1,
      });
    });

    it('should return all records', () => {
      table.insert('items', { id: '1', name: 'a', value: 1 });
      table.insert('items', { id: '2', name: 'b', value: 2 });
      expect(table.findAll('items')).toHaveLength(2);
    });

    it('should update a record by id', () => {
      table.insert('items', { id: '1', name: 'a', value: 1 });
      const updated = table.update<{ id: string; name: string; value: number }>(
        'items',
        '1',
        { value: 100 }
      );
      expect(updated).toEqual({ id: '1', name: 'a', value: 100 });
    });

    it('should delete a record', () => {
      table.insert('items', { id: '1', name: 'a', value: 1 });
      expect(table.delete('items', '1')).toBe(true);
      expect(table.find('items', '1')).toBeUndefined();
    });

    it('should query records by predicate', () => {
      table.insert('items', { id: '1', name: 'a', value: 10 });
      table.insert('items', { id: '2', name: 'b', value: 20 });
      const results = table.query(
        'items',
        (r: { value: number }) => r.value > 15
      );
      expect(results).toHaveLength(1);
    });

    it('should clear a table', () => {
      table.insert('items', { id: '1', name: 'a', value: 1 });
      table.clear('items');
      expect(table.findAll('items')).toEqual([]);
    });

    it('should drop a table', () => {
      table.insert('items', { id: '1', name: 'a', value: 1 });
      table.drop('items');
      expect(table.findAll('items')).toEqual([]);
    });

    it('should drop all tables', () => {
      table.insert('items', { id: '1', name: 'a', value: 1 });
      table.insert('users', { id: 'u1', email: 'a@b.com' });
      table.dropAll();
      expect(table.findAll('items')).toEqual([]);
      expect(table.findAll('users')).toEqual([]);
    });
  });
});
