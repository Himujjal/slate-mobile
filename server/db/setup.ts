import { Database as BunDatabase } from 'bun:sqlite';
import { Kysely, SqliteDialect } from 'kysely';
import type { Database } from './database';

let db: Kysely<Database> | null = null;
let dbPath = process.env.SLATE_DB_PATH || './slate.db';

export function setDbPath(path: string): void {
  dbPath = path;
  if (db) {
    db.destroy();
    db = null;
  }
}

export function getDb(): Kysely<Database> {
  if (!db) {
    db = new Kysely<Database>({
      dialect: new SqliteDialect({
        // biome-ignore lint/suspicious/noExplicitAny: bun:sqlite is runtime-compatible with Kysely's SqliteDatabase interface
        database: new BunDatabase(dbPath) as any,
      }),
    });
  }
  return db;
}

export async function initDb(): Promise<void> {
  const database = getDb();

  await database.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('email', 'text')
    .addColumn('phone', 'text')
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('auth_provider', 'text', (col) =>
      col.notNull().defaultTo('email_otp')
    )
    .addColumn('avatar_url', 'text')
    .addColumn('created_at', 'integer', (col) => col.notNull())
    .addColumn('updated_at', 'integer', (col) => col.notNull())
    .execute();

  await database.schema
    .createTable('refresh_tokens')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('user_id', 'text', (col) =>
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('token', 'text', (col) => col.notNull().unique())
    .addColumn('expires_at', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'integer', (col) => col.notNull())
    .execute();

  await database.schema
    .createTable('otp_codes')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('otp', 'text', (col) => col.notNull())
    .addColumn('method', 'text', (col) => col.notNull())
    .addColumn('expires_at', 'integer', (col) => col.notNull())
    .addColumn('used', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('created_at', 'integer', (col) => col.notNull())
    .execute();

  await database.schema
    .createTable('sessions')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) =>
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('device_info', 'text')
    .addColumn('last_active', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'integer', (col) => col.notNull())
    .execute();
}

export async function closeDb(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
  }
}
