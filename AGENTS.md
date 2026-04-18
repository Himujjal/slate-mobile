# Slate - Agent Guidelines

This document provides guidelines for agents working in this codebase.

## Project Overview

Slate is an Expo (React Native) project using TypeScript, expo-router, and Biome for code quality. The app runs on iOS, Android, and web.

## Build/Lint/Test Commands

```bash
# Development
npm start           # Start Expo dev server (interactive)
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run on web

# Linting & Formatting
npm run lint        # Run Biome check on entire codebase
npm run lint:fix    # Run Biome check with auto-fix

# Project Management
npm run reset-project  # Reset app directory to starter template
```

## Code Style Guidelines

### General Rules

- Use TypeScript with strict mode enabled
- All code must pass Biome linting (`npm run lint`)
- Format all files before committing (`npm run lint:fix`)

### Formatting (Biome)

- Check [biome.json](./biome.json) config file for this

### Imports

- Use path alias `@/` for absolute imports (e.g., `@/components/ThemedText`)
- Organize imports with Biome (enabled in config)
- Group: external libraries → internal modules → relative imports
- Example:
  ```typescript
  import { useState } from 'react';
  import { Image } from 'expo-image';
  import { ThemedText } from '@/components/themed-text';
  ```

### Naming Conventions

- **Files**: kebab-case (e.g., `themed-text.tsx`, `use-theme-color.ts`)
- **Components**: PascalCase (e.g., `ThemedText`, `ParallaxScrollView`)
- **Hooks**: camelCase with `use` prefix (e.g., `useColorScheme`, `useThemeColor`)
- **Types/Interfaces**: PascalCase (e.g., `ThemedTextProps`, `Colors`)
- **Constants**: PascalCase for exported, camelCase for internal

### TypeScript

- Enable strict mode in tsconfig.json
- Prefer explicit types over `any`
- Use `type` for unions/intersections, `interface` for objects
- Export types when used across modules

### Component Patterns

- Use functional components with explicit prop types
- Extract custom hooks for reusable logic
- Use StyleSheet for styling (not inline styles except for dynamic values)
- Keep components focused (single responsibility)

Example component structure:
```typescript
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  // component logic
  return <Text style={[styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontSize: 16 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 20 },
});
```

### Error Handling

- Use try/catch for async operations
- Return meaningful error messages
- Handle platform-specific errors gracefully

### React Native Specifics

- Use `Platform.select()` for platform-specific code
- Handle safe areas with `SafeAreaView` from `react-native-safe-area-context`
- Use `expo-image` instead of `Image` for optimized images
- Use `expo-haptics` for haptic feedback

### Dark Mode Support

- Define colors in `constants/theme.ts` with `Colors.light` and `Colors.dark`
- Use `useThemeColor` hook to get theme-aware colors
- Test UI in both light and dark modes

## File Structure

```
slate/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── _layout.tsx   # Tab layout
│   │   ├── index.tsx     # Home screen
│   │   └── explore.tsx   # Explore screen
│   ├── _layout.tsx       # Root layout
│   └── modal.tsx         # Modal screen
├── components/            # Reusable UI components
│   ├── ui/               # UI primitives
│   └── *.tsx             # Feature components
├── hooks/                 # Custom React hooks
├── constants/             # App constants
├── assets/                 # Images, fonts, etc.
└── biome.json             # Biome configuration
```

## Configuration Files

- **biome.json**: Linting and formatting rules
- **tsconfig.json**: TypeScript configuration (strict mode, path aliases)
- **app.json**: Expo configuration

## Common Patterns

### Navigation

Use `expo-router` file-based routing. Define routes with file structure:
- `app/index.tsx` → `/`
- `app/(tabs)/index.tsx` → `/tabs`
- `app/modal.tsx` → `/modal`

### Theming

```typescript
import { useThemeColor } from '@/hooks/use-theme-color';

const color = useThemeColor({ light: '#fff', dark: '#000' }, 'text');
```

### Platform-Specific Code

```typescript
import { Platform } from 'react-native';

const shortcut = Platform.select({
  ios: 'cmd + d',
  android: 'cmd + m',
  web: 'F12',
});
```

## Additional Notes

- This is an Expo project - avoid ejecting or using bare React Native
- Use Expo libraries when available (expo-image, expo-haptics, etc.)
- Test on both iOS and Android before finalizing UI changes
