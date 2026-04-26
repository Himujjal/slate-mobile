# App Module Guide

The `app/` folder is where you build your application. It uses **expo-router** for file-based routing, where each file becomes a route automatically.

## Current Structure

```
app/
├── _layout.tsx              # Root layout (defines all routes + providers)
├── index.tsx                # Home screen (/)
└── dev-tools/
    ├── index.tsx             # Dev tools menu (/dev-tools)
    ├── flux-test.tsx         # Flux state test UI (/dev-tools/flux-test)
    └── playground/
        ├── _layout.tsx       # Playground with sidebar (/dev-tools/playground)
        └── index.tsx         # Redirects to /dev-tools/playground?component=button
```

## Routing Rules

| File | Route |
|------|-------|
| `app/index.tsx` | `/` |
| `app/settings.tsx` | `/settings` |
| `app/profile/index.tsx` | `/profile` |
| `app/(tabs)/_layout.tsx` | Tab layout |
| `app/(tabs)/index.tsx` | `/tabs` (in tab navigator) |
| `app/(auth)/login.tsx` | `/auth/login` |

Key points:
- `_layout.tsx` files define layouts (not routes)
- `(name)` folders are route groups (organizational, not in URL)
- `[param].tsx` files are dynamic routes (e.g., `[id].tsx` → `/:id`)

## Root Layout (`app/_layout.tsx`)

The root layout wraps all routes with providers and defines the navigation structure.

```typescript
// Current providers (in order):
// 1. ThemeProvider (light/dark theme)
// 2. ToastProvider (toast notifications)
// 3. NavigationContainer (expo-router stack)

// Routes are defined as Stack.Screen components
```

To add new routes, add them to the Stack in `_layout.tsx`:

```typescript
<Stack.Screen name="my-new-screen" options={{ title: 'My Screen' }} />
```

## Creating a New Screen

1. Create `app/my-feature.tsx`:

```typescript
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui/text';
import { Button } from '@ui/button';
import { useThemeColor } from '@ui/theme';

export default function MyFeatureScreen() {
  const bg = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text variant="title">My Feature</Text>
      <Button onPress={() => {}}>Do Something</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

2. Add route in `app/_layout.tsx`:

```typescript
<Stack.Screen name="my-feature" options={{ title: 'My Feature' }} />
```

## Building a Tab-Based App

Create an `app/(tabs)/` folder:

```
app/(tabs)/
  _layout.tsx       # Tab navigator layout
  index.tsx         # First tab (Home)
  explore.tsx       # Second tab (Explore)
  settings.tsx      # Third tab (Settings)
```

Example tab layout (`app/(tabs)/_layout.tsx`):

```typescript
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```

## Common Patterns

### Using State (Flux)

```typescript
import { createKvStore, useFluxValue } from '@flux/core';

const counter$ = createKvStore({
  initial: { count: 0 },
  name: 'counter',
});

export default function CounterScreen() {
  const count = useFluxValue(counter$.count);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button onPress={() => counter$.count.set(count + 1)}>+</Button>
    </View>
  );
}
```

### Using Auth

```typescript
import { useAuth, useUser, useIsAuthenticated } from '@flux/auth-hooks';
import { LoginForm } from '@ui/auth';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => {}} />;
  }

  return (
    <View>
      <Text>Welcome, {user?.name}</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
}
```

### Using API Client

```typescript
import { api } from '@flux/api-client';
import { useState } from 'react';

export default function DataScreen() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const result = await api.get('/api/health');
    setData(result);
  };

  return <Button onPress={fetchData}>Fetch</Button>;
}
```

### Navigation

```typescript
import { router } from 'expo-router';

// Navigate
router.push('/settings');
router.replace('/login');  // no back button
router.back();
```

### Theming

```typescript
import { useThemeColor } from '@ui/theme';
import { useColorScheme } from 'react-native';

const bg = useThemeColor({}, 'background');
const text = useThemeColor({}, 'text');
const scheme = useColorScheme(); // 'light' | 'dark'
```

### Toast Notifications

```typescript
import { useToast } from '@ui/toast';

function MyScreen() {
  const toast = useToast();

  const handleSave = () => {
    toast.show('Saved successfully!', 'success');
    // or: toast.success('Saved!');
    // or: toast.error('Failed!');
    // or: toast.warning('Check your input');
    // or: toast.info('Did you know?');
  };

  return <Button onPress={handleSave}>Save</Button>;
}
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@ui/auth';

export default function DashboardScreen() {
  return (
    <ProtectedRoute fallback="/login">
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

## Feature Organization

For larger features, create a folder:

```
app/
  my-feature/
    _layout.tsx       # Feature-specific layout
    index.tsx         # List view
    [id].tsx          # Detail view
    create.tsx        # Create form
```

## Example: Full Feature Flow

```
app/
  (tabs)/
    _layout.tsx       # Bottom tab navigator
    index.tsx         # Home - list of items
    explore.tsx       # Search/explore
  item/
    _layout.tsx       # Stack for item screens
    index.tsx         # Item list
    [id].tsx          # Single item detail
    create.tsx        # Create new item
  auth/
    _layout.tsx       # Auth stack
    login.tsx         # Login screen
    register.tsx      # Register screen
  _layout.tsx         # Root: wraps everything with providers
  index.tsx           # Root redirect
```

## Dev Tools

The `dev-tools/` folder contains development utilities that you can remove in production:

| Route | Purpose |
|-------|---------|
| `/dev-tools` | Menu linking to test/playground |
| `/dev-tools/flux-test` | Interactive Flux state management tests |
| `/dev-tools/playground` | UI component playground with sidebar |

## Exports Convention

When creating screens, always use `export default` (this is required by expo-router):

```typescript
export default function MyScreen() {
  // ...
}
```
