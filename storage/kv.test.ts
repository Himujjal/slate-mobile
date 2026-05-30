import { beforeEach, describe, expect, it } from 'bun:test';
import { MemoryKvAdapter, kv, setKvAdapter } from './kv';

describe('kv', () => {
  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
  });

  describe('string operations', () => {
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

  describe('number operations', () => {
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

  describe('boolean operations', () => {
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

  describe('object operations', () => {
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
      const result = kv.getObject<(string | number | { three: number })[]>('arr');
      expect(result).toEqual(arr);
    });
  });

  describe('remove operations', () => {
    it('should remove a key', () => {
      kv.setString('key1', 'value');
      kv.remove('key1');
      expect(kv.getString('key1')).toBeUndefined();
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => kv.remove('nonexistent')).not.toThrow();
    });
  });

  describe('clear operations', () => {
    it('should clear all keys', () => {
      kv.setString('key1', 'value1');
      kv.setString('key2', 'value2');
      kv.clear();
      expect(kv.getAllKeys()).toEqual([]);
    });
  });

  describe('getAllKeys', () => {
    it('should return all keys in insertion order', () => {
      kv.setString('a', '1');
      kv.setString('b', '2');
      kv.setString('c', '3');
      expect(kv.getAllKeys()).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array when no keys', () => {
      expect(kv.getAllKeys()).toEqual([]);
    });
  });

  describe('contains', () => {
    it('should return true for existing key', () => {
      kv.setString('key1', 'value');
      expect(kv.contains('key1')).toBe(true);
    });

    it('should return false for missing key', () => {
      expect(kv.contains('nonexistent')).toBe(false);
    });
  });
});
