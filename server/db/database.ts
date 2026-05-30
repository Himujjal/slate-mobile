import type { Generated } from 'kysely';

export interface Database {
  users: {
    id: string;
    email: string;
    name: string;
    password_hash: string | null;
    salt: string | null;
    google_id: string | null;
    avatar_url: string | null;
    created_at: number;
    updated_at: number;
  };

  refresh_tokens: {
    id: Generated<number>;
    user_id: string;
    token: string;
    expires_at: number;
    created_at: number;
  };

  sessions: {
    id: string;
    user_id: string;
    device_info: string | null;
    last_active: number;
    created_at: number;
  };
}
