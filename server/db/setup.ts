import { SqliteTableAdapter, setTableAdapter } from '../../storage';

let adapter: SqliteTableAdapter | null = null;
let dbPath = process.env.SLATE_DB_PATH || './slate.db';

export function setDbPath(path: string): void {
  dbPath = path;
  if (adapter) {
    adapter.close();
    adapter = null;
  }
}

function getOrCreateAdapter(): SqliteTableAdapter {
  if (!adapter) {
    adapter = new SqliteTableAdapter(dbPath);
    setTableAdapter(adapter);
  }
  return adapter;
}

export function initDb(): void {
  getOrCreateAdapter();
}

export function closeDb(): void {
  if (adapter) {
    adapter.close();
    adapter = null;
  }
}
