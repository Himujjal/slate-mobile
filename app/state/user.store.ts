import { createFluxAtom, createKvStore } from '@flux';
import { api } from '@flux/api-client';
import type { AuthUser } from '@flux/auth-store';

export type UserProfile = AuthUser;

const user$ = createKvStore<UserProfile | null>({
  initial: null,
  name: 'user-profile',
});

const isLoading$ = createFluxAtom(false);
const error$ = createFluxAtom<string | null>(null);

export async function fetchUserProfile(): Promise<UserProfile | null> {
  isLoading$.set(true);
  error$.set(null);
  try {
    const user = await api.get<UserProfile>('/auth/me');
    user$.set(user);
    return user;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch user';
    error$.set(message);
    return null;
  } finally {
    isLoading$.set(false);
  }
}

export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<void> {
  const current = user$.peek();
  if (!current) return;
  const updated = await api.put<UserProfile>(`/users/${current.id}`, updates);
  user$.set(updated);
}

export { user$, isLoading$ as userIsLoading$, error$ as userError$ };
