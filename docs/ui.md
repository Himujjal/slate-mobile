# UI Component Library

The `ui/` module contains 20+ reusable React Native components with light/dark theme support, demos, and a playground for testing.

## Import Path

```typescript
import { Button, Card, Text, TextInput, Modal, ... } from '@ui/core';
import { Colors, Spacing, useThemeColor, ThemeProvider } from '@ui/theme';
```

## Theme System

### Colors

```typescript
import { Colors } from '@ui/theme';

// Access theme colors
Colors.light.background   // '#FFFFFF'
Colors.light.text         // '#11181C'
Colors.light.primary      // '#0A84FF'
Colors.dark.background    // '#151718'
Colors.dark.text          // '#ECEDEE'
```

Color tokens available in both light and dark variants:

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `background` | #FFFFFF | #151718 | Main page bg |
| `surface` | #F8F9FA | #1E2022 | Card/element bg |
| `text` | #11181C | #ECEDEE | Primary text |
| `textSecondary` | #687076 | #9BA1A6 | Muted/secondary text |
| `primary` | #0A84FF | #0A84FF | Primary actions |
| `secondary` | #6C47FF | #8B6FFF | Secondary actions |
| `destructive` | #FF453A | #FF453A | Destructive actions |
| `border` | #E4E6E8 | #2C2E30 | Borders, dividers |
| `success` | #30D158 | #30D158 | Success states |
| `warning` | #FF9F0A | #FF9F0A | Warning states |
| `error` | #FF453A | #FF453A | Error states |
| `info` | #5E5CE6 | #7C7AEA | Info states |

### Spacing

```typescript
import { Spacing } from '@ui/theme';

Spacing.xs   // 4
Spacing.sm   // 8
Spacing.md   // 16
Spacing.lg   // 24
Spacing.xl   // 32
Spacing.xxl  // 48
```

### Radius

```typescript
import { Radius } from '@ui/theme';

Radius.sm    // 4
Radius.md    // 8
Radius.lg    // 12
Radius.xl    // 16
Radius.full  // 9999 (for pills/circles)
```

### Font Sizes

```typescript
import { FontSizes, Fonts } from '@ui/theme';

FontSizes.xs     // 12
FontSizes.sm     // 14
FontSizes.md     // 16
FontSizes.lg     // 18
FontSizes.xl     // 20
FontSizes.xxl    // 24
FontSizes.xxxl   // 32

// Font families
Fonts.regular    // System
Fonts.medium     // System (medium weight)
Fonts.bold       // System (bold weight)
```

### Breakpoints

```typescript
import { Breakpoints } from '@ui/theme';

Breakpoints.sm   // 640
Breakpoints.md   // 768
Breakpoints.lg   // 1024
Breakpoints.xl   // 1280
```

### `useThemeColor` Hook

```typescript
import { useThemeColor } from '@ui/theme';

// Get a theme-aware color
const bg = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
const text = useThemeColor({}, 'text'); // uses default Colors token
```

### `ThemeProvider`

Wraps the app for theme context. Already included in `app/_layout.tsx`.

## Complete Component Reference

### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined' \| 'text' \| 'ghost'` | `'filled'` | Visual style |
| `color` | `'primary' \| 'secondary' \| 'destructive'` | `'primary'` | Color scheme |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Show spinner |
| `disabled` | `boolean` | `false` | Disable interaction |
| `onPress` | `() => void` | — | Press handler |
| `children` | `React.ReactNode` | — | Button content |

```typescript
import { Button } from '@ui/button';

<Button variant="filled" color="primary" size="md" onPress={handlePress}>
  Submit
</Button>

<Button variant="outlined" color="destructive" loading>
  Deleting...
</Button>
```

### Text

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'muted' \| 'title' \| 'subtitle' \| 'caption'` | `'default'` | Text style |
| `children` | `React.ReactNode` | — | Text content |

```typescript
import { Text } from '@ui/text';

<Text variant="title">Big Title</Text>
<Text variant="muted">Secondary info</Text>
<Text variant="caption">Small print</Text>
```

### TextInput

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'outlined' \| 'filled' \| 'ghost'` | `'outlined'` | Input style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `label` | `string` | — | Label text above input |
| `error` | `string` | — | Error message below input |
| `placeholder` | `string` | — | Placeholder text |

```typescript
import { TextInput } from '@ui/text-input';

<TextInput
  label="Email"
  placeholder="Enter your email"
  variant="outlined"
  size="md"
  value={email}
  onChangeText={setEmail}
  error={emailError}
/>
```

### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'filled'` | `'default'` | Card style |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Internal padding |
| `elevated` | `boolean` | `false` | Add shadow |
| `children` | `React.ReactNode` | — | Card content |

```typescript
import { Card } from '@ui/card';

<Card elevated padding="lg">
  <Text>Card content</Text>
</Card>
```

### Avatar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `src` | `string` | — | Image URL |
| `initials` | `string` | — | Fallback initials (2 chars) |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | — | Status dot |

```typescript
import { Avatar } from '@ui/avatar';

<Avatar src="https://..." size="lg" status="online" />
<Avatar initials="JD" size="md" />
```

### Badge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Badge style |
| `color` | `'primary' \| 'secondary' \| 'destructive' \| 'muted'` | `'primary'` | Color scheme |
| `size` | `'sm' \| 'md'` | `'sm'` | Badge size |
| `children` | `React.ReactNode` | — | Badge content |

```typescript
<Badge color="destructive">3</Badge>
<Badge variant="outlined" color="secondary">New</Badge>
```

### Chip

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Chip style |
| `size` | `'sm' \| 'md'` | `'md'` | Chip size |
| `selected` | `boolean` | `false` | Selected state |
| `closable` | `boolean` | `false` | Show close button |
| `onPress` | `() => void` | — | Press handler |
| `onClose` | `() => void` | — | Close handler |
| `children` | `React.ReactNode` | — | Chip content |

```typescript
<Chip selected>Active Filter</Chip>
<Chip closable onClose={() => {}}>Tag</Chip>
```

### Checkbox

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | `false` | Check state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Checkbox size |
| `label` | `string` | — | Label text |
| `disabled` | `boolean` | `false` | Disable interaction |
| `onValueChange` | `(checked: boolean) => void` | — | Change handler |

```typescript
<Checkbox
  checked={agreed}
  onValueChange={setAgreed}
  label="I agree to the terms"
/>
```

### Switch

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `boolean` | `false` | Switch state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Switch size |
| `label` | `string` | — | Label text |
| `disabled` | `boolean` | `false` | Disable interaction |
| `onValueChange` | `(value: boolean) => void` | — | Change handler |

```typescript
<Switch
  value={notifications}
  onValueChange={setNotifications}
  label="Enable notifications"
/>
```

### Slider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md'` | `'md'` | Slider size |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `value` | `number` | — | Controlled value |
| `defaultValue` | `number` | — | Uncontrolled default |
| `disabled` | `boolean` | `false` | Disable interaction |
| `onValueChange` | `(value: number) => void` | — | Change handler |

```typescript
<Slider
  min={0}
  max={100}
  step={5}
  defaultValue={50}
  onValueChange={setVolume}
/>
```

### RadioButton & RadioGroup

| Prop (RadioButton) | Type | Default | Description |
|--------------------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Radio size |
| `checked` | `boolean` | `false` | Selected state |
| `label` | `string` | — | Label text |
| `disabled` | `boolean` | `false` | Disable interaction |
| `onPress` | `() => void` | — | Press handler |

```typescript
import { RadioGroup, RadioButton } from '@ui/radio-button';

<RadioGroup value={selected} onValueChange={setSelected}>
  <RadioButton value="option1" label="Option 1" />
  <RadioButton value="option2" label="Option 2" />
  <RadioButton value="option3" label="Option 3" />
</RadioGroup>
```

### Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Icon size |
| `color` | `'primary' \| 'muted' \| 'destructive' \| 'accent' \| 'secondary'` | `'primary'` | Icon color |
| `rotation` | `number` | — | Rotation degrees |
| `children` | `React.ReactNode` | — | Icon content |

```typescript
<Icon size="lg" color="primary">{'⭐'}</Icon>
```

### Image

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | — | Preset size |
| `width` | `number` | — | Custom width |
| `height` | `number` | — | Custom height |
| `aspectRatio` | `number` | — | Aspect ratio (e.g. 16/9) |
| `resizeMode` | `'cover' \| 'contain' \| 'stretch'` | `'cover'` | Image fit mode |
| `placeholder` | `string` | — | Placeholder tint |
| `errorFallback` | `React.ReactNode` | — | Custom error UI |
| `source` | `string` | — | Image URL |

Uses `expo-image` under the hood.

```typescript
import { Image } from '@ui/image';

<Image
  source="https://..."
  size="xl"
  resizeMode="cover"
  placeholder="#E4E6E8"
/>
```

### Divider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider direction |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Divider thickness |
| `label` | `string` | — | Text in the middle |
| `labelPosition` | `'left' \| 'center' \| 'right'` | `'center'` | Label alignment |

```typescript
<Divider />
<Divider label="OR" />
<Divider orientation="vertical" />
```

### ListItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | List item size |
| `title` | `string` | — | Primary text |
| `subtitle` | `string` | — | Secondary text |
| `leading` | `React.ReactNode` | — | Left-side content (Icon, Avatar, etc.) |
| `trailing` | `React.ReactNode` | — | Right-side content |
| `selectable` | `boolean` | `false` | Show selection highlight |
| `selected` | `boolean` | `false` | Selected state |
| `onPress` | `() => void` | — | Press handler |
| `divider` | `boolean` | `false` | Bottom divider |

```typescript
<ListItem
  title="John Doe"
  subtitle="john@example.com"
  leading={<Avatar initials="JD" size="sm" />}
  trailing={<Badge>New</Badge>}
  onPress={() => {}}
/>
```

### FAB (Floating Action Button)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | FAB size |
| `color` | `'primary' \| 'secondary' \| 'destructive'` | `'primary'` | Color scheme |
| `icon` | `React.ReactNode` | — | Icon content |
| `label` | `string` | — | Extended label (shows text next to icon) |
| `onPress` | `() => void` | — | Press handler |

```typescript
<FAB icon="+" onPress={handleAdd} />
<FAB icon="+" label="Add Item" size="lg" />
```

### Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Show/hide modal |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Modal width |
| `animation` | `'none' \| 'slide' \| 'fade'` | `'slide'` | Entry animation |
| `title` | `string` | — | Modal title |
| `closable` | `boolean` | `true` | Show close button |
| `actions` | `{ label: string; onPress: () => void; variant?: ... }[]` | — | Footer buttons |
| `onClose` | `() => void` | — | Close handler |
| `children` | `React.ReactNode` | — | Modal body |

```typescript
<Modal
  visible={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm"
  actions={[
    { label: 'Cancel', variant: 'ghost', onPress: () => {} },
    { label: 'Confirm', variant: 'filled', onPress: handleConfirm },
  ]}
>
  <Text>Are you sure?</Text>
</Modal>
```

### BottomSheet

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Show/hide sheet |
| `snapPoints` | `string[]` | `['50%']` | Snap positions (% of screen) |
| `title` | `string` | — | Sheet title |
| `closable` | `boolean` | `true` | Show close button |
| `showDragHandle` | `boolean` | `true` | Drag indicator |
| `onClose` | `() => void` | — | Close handler |
| `children` | `React.ReactNode` | — | Sheet body |

```typescript
<BottomSheet
  visible={showSheet}
  onClose={() => setShowSheet(false)}
  snapPoints={['25%', '50%', '90%']}
  title="Options"
>
  <Text>Bottom sheet content</Text>
</BottomSheet>
```

### Toast (via ToastProvider + useToast)

```typescript
import { useToast } from '@ui/toast';

function MyComponent() {
  const toast = useToast();

  return (
    <Button onPress={() => toast.show('Saved!', 'success')}>
      Save
    </Button>
  );
}
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `show` | `(message: string, type?: ToastType, action?: ToastAction) => void` | Show a toast |
| `success` | `(message: string) => void` | Success toast |
| `error` | `(message: string) => void` | Error toast |
| `warning` | `(message: string) => void` | Warning toast |
| `info` | `(message: string) => void` | Info toast |
| `dismiss` | `() => void` | Dismiss current toast |

Toast types: `'info' \| 'success' \| 'warning' \| 'error'`

Must be wrapped in `<ToastProvider>` (already in `app/_layout.tsx`).

### Skeleton & SkeletonGroup

| Prop (Skeleton) | Type | Default | Description |
|-----------------|------|---------|-------------|
| `shape` | `'text' \| 'circle' \| 'rounded-rect'` | `'text'` | Skeleton shape |
| `width` | `number` | — | Custom width |
| `height` | `number` | — | Custom height |
| `lines` | `number` | — | For text shape, number of lines |

```typescript
import { Skeleton, SkeletonGroup } from '@ui/skeleton';

<Skeleton shape="circle" size={40} />
<SkeletonGroup spacing={8}>
  <Skeleton shape="text" lines={3} />
  <Skeleton shape="rounded-rect" width={200} height={40} />
</SkeletonGroup>
```

### Sidebar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ label: string; icon?: string; onPress: () => void }[]` | — | Navigation items |
| `collapsed` | `boolean` | `false` | Collapsed state |
| `onToggleCollapse` | `() => void` | — | Toggle handler |
| `width` | `number` | `240` | Sidebar width |

```typescript
<Sidebar
  items={[
    { label: 'Home', icon: '🏠', onPress: () => {} },
    { label: 'Settings', icon: '⚙️', onPress: () => {} },
  ]}
  collapsed={sidebarCollapsed}
  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
/>
```

## Auth Components

### AuthProvider & useAuthContext

```typescript
import { AuthProvider, useAuthContext } from '@ui/auth';

// Wrap your app (already done if using _layout.tsx)
<AuthProvider>
  <App />
</AuthProvider>

// In any component:
const { user, isLoading, isAuthenticated, login, logout } = useAuthContext();
```

### LoginForm

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSuccess` | `() => void` | — | Called after successful login |
| `redirectTo` | `string` | — | Route to redirect on success |

```typescript
<LoginForm onSuccess={() => router.replace('/(tabs)')} />
```

### RegisterForm

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSuccess` | `() => void` | — | Called after successful registration |
| `redirectTo` | `string` | — | Route to redirect on success |

```typescript
<RegisterForm onSuccess={() => router.replace('/(tabs)')} />
```

### ProtectedRoute

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fallback` | `string` | `'/'` | Route to redirect if not authenticated |
| `children` | `React.ReactNode` | — | Protected content |

```typescript
<ProtectedRoute fallback="/login">
  <SecretScreen />
</ProtectedRoute>
```

## Creating New Components

### File Structure

```
ui/my-component/
  my-component.tsx       # Component implementation
  my-component-demo.tsx  # Demo for playground
```

### Component Template

```typescript
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useThemeColor } from '@ui/theme';

export type MyComponentProps = {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function MyComponent({
  variant = 'default',
  size = 'md',
  label,
  disabled = false,
  onPress,
  style,
}: MyComponentProps) {
  const bgColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, { backgroundColor: bgColor }, style]}>
      {/* component logic */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
});
```

### Conventions

1. **One component per folder** in `ui/`
2. **Export types** alongside component: `export type MyComponentProps = ...`
3. **Use `useThemeColor`** for all colors (never hardcode)
4. **StyleSheet.create** for static styles (not inline)
5. **Demo file** with `_demo` suffix showing all variants
6. **Functional components** with explicit prop types

### Registration Checklist

After creating a new component, register it:

1. **Barrel export**: Add to `ui/index.tsx`
2. **Playground**: Add import and entry to `COMPONENT_MAP` in `ui/playground.tsx`
3. **Playground route**: Add route in `app/dev-tools/playground/_layout.tsx`
