import { beforeEach, describe, expect, it } from 'bun:test';
import { MemoryTableAdapter, setTableAdapter, table } from './table';

type TestRow = {
  [key: string]: unknown;
  id: string;
  name: string;
  value: number;
};

describe('table', () => {
  beforeEach(() => {
    setTableAdapter(new MemoryTableAdapter());
  });

  describe('insert', () => {
    it('should insert a record and return it', () => {
      const record = table.insert<TestRow>('items', {
        id: '1',
        name: 'item1',
        value: 42,
      });
      expect(record).toEqual({ id: '1', name: 'item1', value: 42 });
    });

    it('should allow multiple inserts to same table', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 1 });
      table.insert<TestRow>('items', { id: '2', name: 'b', value: 2 });
      const all = table.findAll<TestRow>('items');
      expect(all).toHaveLength(2);
    });
  });

  describe('find', () => {
    it('should find a record by id', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 1 });
      table.insert<TestRow>('items', { id: '2', name: 'b', value: 2 });
      const found = table.find<TestRow>('items', '1');
      expect(found).toEqual({ id: '1', name: 'a', value: 1 });
    });

    it('should return undefined for non-existent id', () => {
      expect(table.find<TestRow>('items', 'nonexistent')).toBeUndefined();
    });

    it('should return undefined for empty table', () => {
      expect(table.find<TestRow>('empty-table', '1')).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all records', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 1 });
      table.insert<TestRow>('items', { id: '2', name: 'b', value: 2 });
      const all = table.findAll<TestRow>('items');
      expect(all).toEqual([
        { id: '1', name: 'a', value: 1 },
        { id: '2', name: 'b', value: 2 },
      ]);
    });

    it('should return empty array for new table', () => {
      expect(table.findAll('new-table')).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a record by id', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 1 });
      const updated = table.update<TestRow>('items', '1', { value: 100 });
      expect(updated).toEqual({ id: '1', name: 'a', value: 100 });
    });

    it('should return undefined for non-existent id', () => {
      expect(
        table.update<TestRow>('items', 'nonexistent', { value: 100 })
      ).toBeUndefined();
    });

    it('should only update specified fields', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 1 });
      const updated = table.update<TestRow>('items', '1', { name: 'updated' });
      expect(updated).toEqual({ id: '1', name: 'updated', value: 1 });
    });
  });

  describe('delete', () => {
    it('should delete a record and return true', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 1 });
      expect(table.delete('items', '1')).toBe(true);
      expect(table.find<TestRow>('items', '1')).toBeUndefined();
    });

    it('should return false for non-existent id', () => {
      expect(table.delete('items', 'nonexistent')).toBe(false);
    });
  });

  describe('query', () => {
    it('should filter records by predicate', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 10 });
      table.insert<TestRow>('items', { id: '2', name: 'b', value: 20 });
      table.insert<TestRow>('items', { id: '3', name: 'c', value: 30 });
      const results = table.query<TestRow>('items', (r) => r.value > 15);
      expect(results).toEqual([
        { id: '2', name: 'b', value: 20 },
        { id: '3', name: 'c', value: 30 },
      ]);
    });

    it('should return empty array when no matches', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 10 });
      const results = table.query<TestRow>('items', (r) => r.value > 100);
      expect(results).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should remove all records from a table', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 1 });
      table.insert<TestRow>('items', { id: '2', name: 'b', value: 2 });
      table.clear('items');
      expect(table.findAll<TestRow>('items')).toEqual([]);
    });
  });

  describe('drop', () => {
    it('should remove the table entirely', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 1 });
      table.drop('items');
      expect(table.findAll<TestRow>('items')).toEqual([]);
    });
  });

  describe('dropAll', () => {
    it('should remove all tables', () => {
      table.insert<TestRow>('items', { id: '1', name: 'a', value: 1 });
      table.insert('users', { id: 'u1', email: 'a@b.com' });
      table.dropAll();
      expect(table.findAll('items')).toEqual([]);
      expect(table.findAll('users')).toEqual([]);
    });
  });
});
