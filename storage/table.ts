import type { TableAdapter } from './types';

type Row = Record<string, unknown>;

export class MemoryTableAdapter implements TableAdapter {
  private tables: Map<string, Row[]>;

  constructor() {
    this.tables = new Map<string, Row[]>();
  }

  private ensureTable(table: string): Row[] {
    let rows = this.tables.get(table);
    if (!rows) {
      rows = [];
      this.tables.set(table, rows);
    }
    return rows;
  }

  insert<T extends Row>(table: string, record: T): T {
    const rows = this.ensureTable(table);
    rows.push(record);
    return record;
  }

  find<T extends Row>(table: string, id: string): T | undefined {
    const rows = this.ensureTable(table);
    return rows.find((row) => row.id === id) as T | undefined;
  }

  findAll<T extends Row>(table: string): T[] {
    return this.ensureTable(table) as T[];
  }

  update<T extends Row>(
    table: string,
    id: string,
    data: Partial<T>
  ): T | undefined {
    const rows = this.ensureTable(table);
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) return undefined;
    rows[index] = { ...rows[index], ...data };
    return rows[index] as T;
  }

  delete(table: string, id: string): boolean {
    const rows = this.ensureTable(table);
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) return false;
    rows.splice(index, 1);
    return true;
  }

  query<T extends Row>(table: string, predicate: (record: T) => boolean): T[] {
    const rows = this.ensureTable(table);
    return rows.filter(predicate as (record: Row) => boolean) as T[];
  }

  clear(table: string): void {
    this.tables.set(table, []);
  }

  drop(table: string): void {
    this.tables.delete(table);
  }

  dropAll(): void {
    this.tables.clear();
  }
}

let currentAdapter: TableAdapter = new MemoryTableAdapter();

export function setTableAdapter(adapter: TableAdapter): void {
  currentAdapter = adapter;
}

export function resetTableAdapter(): void {
  currentAdapter = new MemoryTableAdapter();
}

export const table = {
  insert: <T extends Row>(tableName: string, record: T): T => {
    return currentAdapter.insert<T>(tableName, record);
  },
  find: <T extends Row>(tableName: string, id: string): T | undefined => {
    return currentAdapter.find<T>(tableName, id);
  },
  findAll: <T extends Row>(tableName: string): T[] => {
    return currentAdapter.findAll<T>(tableName);
  },
  update: <T extends Row>(
    tableName: string,
    id: string,
    data: Partial<T>
  ): T | undefined => {
    return currentAdapter.update<T>(tableName, id, data);
  },
  delete: (tableName: string, id: string): boolean => {
    return currentAdapter.delete(tableName, id);
  },
  query: <T extends Row>(
    tableName: string,
    predicate: (record: T) => boolean
  ): T[] => {
    return currentAdapter.query<T>(tableName, predicate);
  },
  clear: (tableName: string): void => {
    currentAdapter.clear(tableName);
  },
  drop: (tableName: string): void => {
    currentAdapter.drop(tableName);
  },
  dropAll: (): void => {
    currentAdapter.dropAll();
  },
};

export type Table = typeof table;
