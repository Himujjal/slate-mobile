# Axion UI Library (`@ui/`)

This directory contains the shared component library used across the app. Each component follows a strict file structure and pattern.

---

## For Developers: Creating a New Component

### 1. Directory Structure

Every component lives in its own subdirectory with exactly two files:

```
ui/
├── component-name/           # kebab-case directory name
│   ├── component-name.tsx    # the component implementation
│   └── component-name-demo.tsx  # playground demo
├── ui/index.tsx              # barrel export (add re-export here)
├── ui/playground.tsx         # register demo here
└── ui/AGENTS.md              # this file
```

### 2. Component File Template

`ui/component-name/component-name.tsx`:

```tsx
import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { Colors, Radius, Spacing, useThemeColor } from '../theme';

type ComponentVariant = 'default' | 'something';
type ComponentSize = 'sm' | 'md' | 'lg';

interface ComponentNameProps extends ViewProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  children?: React.ReactNode;
}

export function ComponentName({
  variant = 'default',
  size = 'md',
  children,
  style,
  ...props
}: ComponentNameProps) {
  const bg = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const fg = useThemeColor({ light: Colors.light.foreground, dark: Colors.dark.foreground });

  const dynamicStyles = useMemo(() => ({
    backgroundColor: bg,
  }), [bg]);

  return (
    <View style={[dynamicStyles, style]} {...props}>
      {children}
    </View>
  );
}
```

**Rules:**
- Define local type unions at the top (never a separate file)
- Import theme tokens from `../theme` (use `Colors`, `Spacing`, `Radius`, `FontSizes`, `Fonts`)
- Use `useThemeColor({ light, dark })` for any color that needs dark mode support
- Prefer `useMemo` for styles that depend on theme values
- Use `StyleSheet.create()` for static styles only
- Use `forwardRef` + `displayName` when the component needs a ref (e.g., interactive inputs)
- Every exported type must be prefixed `export` if used externally

### 3. Demo File Template

`ui/component-name/component-name-demo.tsx`:

```tsx
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { ComponentName } from './component-name';

export function ComponentNameDemo() {
  const mutedFg = useThemeColor({ light: Colors.light.mutedForeground, dark: Colors.dark.mutedForeground });
  const mutedBg = useThemeColor({ light: Colors.light.muted, dark: Colors.dark.muted });

  const styles = useMemo(() => StyleSheet.create({
    container: { gap: Spacing[6] },
    section: { gap: Spacing[3] },
    sectionTitle: { fontSize: FontSizes.sm, fontWeight: '600', color: mutedFg, textTransform: 'uppercase', letterSpacing: 0.5 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[3], backgroundColor: mutedBg, padding: Spacing[4], borderRadius: Radius.lg },
  }), [mutedFg, mutedBg]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variants</Text>
        <View style={styles.row}>
          <ComponentName variant="default" />
          <ComponentName variant="something" />
        </View>
      </View>
    </View>
  );
}
```

**Demo conventions:**
- Export `{Name}Demo` as a function component (no default exports)
- Always show: variants, colors, sizes, states (disabled, loading, etc.)
- Wrap each section in a `<View>` with `sectionTitle` + `row`/`grid`
- Use `mutedFg` for labels, `mutedBg` for demo area backgrounds
- Use `Spacing[ ]`, `Radius.*`, `FontSizes.*` everywhere — no raw values

### 4. Registration Steps

After creating the files, register the component in **two** places:

#### a) Barrel export — `ui/index.tsx`

Add a line in alphabetical order:

```tsx
export * from './component-name/component-name';
```

#### b) Playground — `ui/playground.tsx`

1. Import the demo at the top (alphabetically):
```tsx
import { ComponentNameDemo } from './component-name/component-name-demo';
```

2. Add to the `ComponentName` union type (alphabetically):
```tsx
type ComponentName = ... | 'ComponentName';
```

3. Add to the `COMPONENTS` array (alphabetically):
```tsx
const COMPONENTS: ComponentName[] = [ ..., 'ComponentName', ... ];
```

4. Add a case in `DemoContent`:
```tsx
case 'ComponentName':
  return <ComponentNameDemo />;
```

### 5. Code Style

- No JSDoc comments — code should be self-documenting
- No inline comments — use descriptive names instead
- No default exports — only named exports
- No `any` — use explicit types
- Format with `npm run lint:fix` before committing

---

## For Consumers: Using the UI Library

### Importing

```tsx
import { Button, Card, Text, Badge } from '@ui/index';
```

All components re-export from `ui/index.tsx` via the `@ui` path alias.

### Theming

```tsx
import { useThemeColor, useTheme, ThemeProvider, ThemeToggleButton } from '@ui/theme';
import { Colors, Spacing, Radius, FontSizes } from '@ui/theme';
```

- Wrap your app root with `<ThemeProvider>` to enable dark mode
- Use `useThemeColor({ light: '#fff', dark: '#000' })` in components
- Use `useTheme()` to access `{ theme, toggleTheme }`
- Use design tokens (`Colors`, `Spacing`, `Radius`, `FontSizes`) instead of raw values

### Playground

The playground is a development tool exposed via `@ui/playground`. It renders a sidebar of all components and shows the selected component's demo.

```tsx
import { Playground } from '@ui/playground';
```

### List of Components

| Import Path | Component | Props |
|---|---|---|
| `@ui/text` | `Text` | `variant?: 'default' \| 'muted' \| 'title' \| 'subtitle' \| 'caption'` |
| `@ui/button` | `Button` | `variant?: 'filled' \| 'outlined' \| 'text' \| 'ghost'`, `color?: 'primary' \| 'secondary' \| 'destructive'`, `size?: 'sm' \| 'md' \| 'lg'`, `loading?: boolean` |
| `@ui/card` | `Card` | `variant?: 'default' \| 'filled'`, `padding?: 'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'`, `elevated?: boolean` |
| `@ui/badge` | `Badge` | `variant?: 'filled' \| 'outlined'`, `color?: 'primary' \| 'secondary' \| 'destructive' \| 'muted'`, `size?: 'sm' \| 'md'` |
| ... | (see component files for full API) |

All components accept the standard React Native props for their base element (e.g., `PressableProps` for Button, `ViewProps` for Card, `TextProps` for Badge).
