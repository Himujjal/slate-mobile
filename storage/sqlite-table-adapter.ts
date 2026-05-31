import { Database as BunDatabase } from 'bun:sqlite';
import type { TableAdapter } from './types';

function sanitizeTableName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

export class SqliteTableAdapter implements TableAdapter {
  private db: BunDatabase;

  constructor(dbPath = './slate.db') {
    this.db = new BunDatabase(dbPath);
    this.db.run('PRAGMA journal_mode = WAL');
  }

  private ensureTable(tableName: string): void {
    const safe = sanitizeTableName(tableName);
    this.db.run(
      `CREATE TABLE IF NOT EXISTS "${safe}" (id TEXT PRIMARY KEY, data TEXT NOT NULL)`
    );
  }

  insert<T extends Record<string, unknown>>(tableName: string, record: T): T {
    this.ensureTable(tableName);
    const safe = sanitizeTableName(tableName);
    const id =
      ((record as Record<string, unknown>).id as string) ?? crypto.randomUUID();
    const data = JSON.stringify({ ...record, id });
    this.db.run(`INSERT OR REPLACE INTO "${safe}" (id, data) VALUES (?, ?)`, [
      id,
      data,
    ]);
    return { ...record, id } as T;
  }

  find<T extends Record<string, unknown>>(
    tableName: string,
    id: string
  ): T | undefined {
    this.ensureTable(tableName);
    const safe = sanitizeTableName(tableName);
    const row = this.db
      .query(`SELECT data FROM "${safe}" WHERE id = ?`)
      .get(id) as { data: string } | undefined;
    if (!row) return undefined;
    return JSON.parse(row.data) as T;
  }

  findAll<T extends Record<string, unknown>>(tableName: string): T[] {
    this.ensureTable(tableName);
    const safe = sanitizeTableName(tableName);
    const rows = this.db.query(`SELECT data FROM "${safe}"`).all() as {
      data: string;
    }[];
    return rows.map((row) => JSON.parse(row.data) as T);
  }

  update<T extends Record<string, unknown>>(
    tableName: string,
    id: string,
    data: Partial<T>
  ): T | undefined {
    const existing = this.find<Record<string, unknown>>(tableName, id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, id } as unknown as T;
    const safe = sanitizeTableName(tableName);
    this.db.run(`UPDATE "${safe}" SET data = ? WHERE id = ?`, [
      JSON.stringify(updated),
      id,
    ]);
    return updated;
  }

  delete(tableName: string, id: string): boolean {
    this.ensureTable(tableName);
    const safe = sanitizeTableName(tableName);
    const result = this.db.run(`DELETE FROM "${safe}" WHERE id = ?`, [id]);
    return result.changes > 0;
  }

  query<T extends Record<string, unknown>>(
    tableName: string,
    predicate: (record: T) => boolean
  ): T[] {
    return this.findAll<T>(tableName).filter(predicate);
  }

  clear(tableName: string): void {
    this.ensureTable(tableName);
    const safe = sanitizeTableName(tableName);
    this.db.run(`DELETE FROM "${safe}"`);
  }

  drop(tableName: string): void {
    const safe = sanitizeTableName(tableName);
    this.db.run(`DROP TABLE IF EXISTS "${safe}"`);
  }

  dropAll(): void {
    const tables = this.db
      .query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      )
      .all() as { name: string }[];
    for (const table of tables) {
      this.db.run(`DROP TABLE IF EXISTS "${table.name}"`);
    }
  }

  close(): void {
    this.db.close();
  }
}
