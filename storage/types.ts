export interface KvAdapter {
  getString(key: string): string | undefined;
  setString(key: string, value: string): void;
  getNumber(key: string): number | undefined;
  setNumber(key: string, value: number): void;
  getBoolean(key: string): boolean | undefined;
  setBoolean(key: string, value: boolean): void;
  getObject<T>(key: string): T | undefined;
  setObject<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  getAllKeys(): string[];
  contains(key: string): boolean;
}

export interface TableAdapter {
  insert<T extends Record<string, unknown>>(table: string, record: T): T;
  find<T extends Record<string, unknown>>(
    table: string,
    id: string
  ): T | undefined;
  findAll<T extends Record<string, unknown>>(table: string): T[];
  update<T extends Record<string, unknown>>(
    table: string,
    id: string,
    data: Partial<T>
  ): T | undefined;
  delete(table: string, id: string): boolean;
  query<T extends Record<string, unknown>>(
    table: string,
    predicate: (record: T) => boolean
  ): T[];
  clear(table: string): void;
  drop(table: string): void;
  dropAll(): void;
}
