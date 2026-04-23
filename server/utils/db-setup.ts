import { Kysely } from 'kysely';

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

let db: Kysely<Database> | null = null;

export function getDb(): Kysely<Database> {
  if (!db) {
    db = new Kysely<Database>({
      dialect: {
        createAdapter: () => {
          throw new Error('Database adapter not configured');
        },
        createDriver: () => {
          throw new Error('Database driver not configured');
        },
        createIntrospector: () => {
          throw new Error('Database introspector not configured');
        },
      },
    });
  }
  return db;
}

export async function initDb(): Promise<void> {
  console.log(
    'Database initialization not implemented - configure adapter first'
  );
}
