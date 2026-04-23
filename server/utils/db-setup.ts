import type { Kysely } from 'kysely';

export interface Database {
  users: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  };
  classrooms: {
    id: string;
    userId: string;
    data: string;
    createdAt: Date;
  };
  jobs: {
    id: string;
    userId: string;
    status: 'pending' | 'running' | 'succeeded' | 'failed';
    progress: number;
    step: string;
    result: string | null;
    createdAt: Date;
  };
}

const db: Kysely<Database> | null = null;

export function getDb(): Kysely<Database> {
  if (!db) {
    throw new Error('Database not configured');
  }
  return db;
}

export async function initDb(): Promise<void> {
  console.log(
    'Database initialization not implemented - configure adapter first'
  );
}
