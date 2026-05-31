export interface Database {
  users: {
    id: string;
    email: string | null;
    phone: string | null;
    name: string;
    auth_provider: string;
    avatar_url: string | null;
    created_at: number;
    updated_at: number;
  };

  refresh_tokens: {
    id: number;
    user_id: string;
    token: string;
    expires_at: number;
    created_at: number;
  };

  otp_codes: {
    id: number;
    identifier: string;
    otp: string;
    method: string;
    expires_at: number;
    used: number;
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
