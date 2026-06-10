import { createSyncedValue } from '@flux';
import { useValue } from '@legendapp/state/react';

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

export function useSettingsState() {
  const theme = useValue(settings$.theme) as SettingsData['theme'];
  const notifications = useValue(settings$.notifications) as boolean;
  const language = useValue(settings$.language) as string;

  const setTheme = (value: SettingsData['theme']) => {
    settings$.theme.set(value);
  };

  const setNotifications = (value: boolean) => {
    settings$.notifications.set(value);
  };

  const setLanguage = (value: string) => {
    settings$.language.set(value);
  };

  return {
    theme,
    notifications,
    language,
    setTheme,
    setNotifications,
    setLanguage,
  };
}
