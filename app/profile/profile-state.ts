import { createSyncedValue } from '@flux';
import { api } from '@flux/api-client';
import type { AuthUser } from '@flux/auth-store';
import { useValue } from '@legendapp/state/react';
import { useEffect, useState } from 'react';

export type UserProfile = AuthUser;

export const user$ = createSyncedValue<UserProfile | null>({
  initial: null,
  name: 'user-profile',
  fetch: () => api.get<UserProfile>('/auth/me').catch(() => null),
  update: (changes) => api.put<UserProfile>('/users/me', changes),
});

export function useProfileState() {
  const user = useValue(user$) as UserProfile | null;
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? '');
    }
  }, [user]);

  const save = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await user$.set({ ...user, name, phone } as UserProfile);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    name,
    phone,
    isSaving,
    setName,
    setPhone,
    save,
  };
}
