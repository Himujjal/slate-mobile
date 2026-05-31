import { createSyncedValue } from '@flux';
import { api } from '@flux/api-client';
import type { AuthUser } from '@flux/auth-store';

export type UserProfile = AuthUser;

export const user$ = createSyncedValue<UserProfile | null>({
  initial: null,
  name: 'user-profile',
  fetch: () => api.get<UserProfile>('/auth/me').catch(() => null),
  update: (changes) => api.put<UserProfile>('/users/me', changes),
});
