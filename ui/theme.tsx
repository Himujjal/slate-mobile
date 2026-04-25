import { kv } from '@storage/kv';
import { setBackgroundColorAsync } from 'expo-system-ui';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Platform, Pressable, Text, useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const Colors = {
  light: {
    background: '#ffffff',
    foreground: '#09090b',
    card: '#ffffff',
    cardForeground: '#09090b',
    primary: '#0a7ea4',
    primaryForeground: '#ffffff',
    secondary: '#f4f4f5',
    secondaryForeground: '#18181b',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    accent: '#f4f4f5',
    accentForeground: '#18181b',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e4e4e7',
    input: '#e4e4e7',
    ring: '#0a7ea4',
  },
  dark: {
    background: '#09090b',
    foreground: '#fafafa',
    card: '#18181b',
    cardForeground: '#fafafa',
    primary: '#0a7ea4',
    primaryForeground: '#ffffff',
    secondary: '#27272a',
    secondaryForeground: '#fafafa',
    muted: '#27272a',
    mutedForeground: '#a1a1aa',
    accent: '#27272a',
    accentForeground: '#fafafa',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#27272a',
    input: '#27272a',
    ring: '#0a7ea4',
  },
};

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const Radius = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const THEME_KEY = '@theme';

function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeColor(
  color: { light: string; dark: string },
  _colorName?: keyof (typeof Colors)['light']
) {
  const { theme } = useTheme();
  return theme === 'dark' ? color.dark : color.light;
}

function useThemeState() {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = kv.getString(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      return;
    }

    const systemTheme = systemColorScheme ?? 'light';
    setTheme(systemTheme);
    kv.setString(THEME_KEY, systemTheme);
  }, [systemColorScheme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      kv.setString(THEME_KEY, newTheme);
      return newTheme;
    });
  }, []);

  return { theme, toggleTheme };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useThemeState();

  useEffect(() => {
    const backgroundColor =
      theme === 'dark' ? Colors.dark.background : Colors.light.background;
    setBackgroundColorAsync(backgroundColor);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Pressable
      onPress={toggleTheme}
      style={{
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors[theme].secondary,
      }}
    >
      <Text style={{ color: Colors[theme].secondaryForeground }}>
        {isDark ? '🌙' : '☀️'}
      </Text>
    </Pressable>
  );
}
