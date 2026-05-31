import { createSyncedValue } from '@flux';

export interface SettingsData {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export const settings$ = createSyncedValue<SettingsData>({
  initial: {
    theme: 'light',
    notifications: true,
    language: 'en',
  },
  name: 'settings',
  fetch: async () => ({
    theme: 'light',
    notifications: true,
    language: 'en',
  }),
  update: async (changes) => changes as SettingsData,
});
