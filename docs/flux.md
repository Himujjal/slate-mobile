# Flux State Management

Flux is the state management layer built on [Legend-State v3](https://legendapp.com/state/v3/). It provides stores, actions, hooks, auth, and an API client.

## Import Path

```typescript
import { ... } from '@flux/core';
// or
import { ... } from '@flux/index';  // barrel export
```

## Store Types

### `createKvStore`

A simple key-value observable store. Best for global app state (settings, auth, UI state).

```typescript
import { createKvStore, useFluxValue } from '@flux/core';

const settings$ = createKvStore({
  initial: { theme: 'light', fontSize: 16, notifications: true },
  name: 'settings',
});

// In a component:
function ThemeDisplay() {
  const theme = useFluxValue(settings$.theme);
  return <Text>Current theme: {theme}</Text>;
}
```

### `createTabularStore`

An array-based store for collections of items. Best for lists, search results, data tables.

```typescript
import { createTabularStore } from '@flux/core';
import { useFluxValue } from '@flux/core';

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const todos$ = createTabularStore<Todo>({
  initial: [
    { id: '1', text: 'Learn Axion', done: false },
    { id: '2', text: 'Build something', done: false },
  ],
  name: 'todos',
});

function TodoList() {
  const todos = useFluxValue(todos$.all);
  return todos.map(t => <Text key={t.id}>{t.text}</Text>);
}
```

### `createFluxStore`

A generic observable wrapper. Most flexible, use when you need custom structure.

```typescript
import { createFluxStore } from '@flux/core';

const counter$ = createFluxStore({ count: 0 });
counter$.count.set(5);
```

### `createFluxAtom`

A simple primitive observable wrapper.

```typescript
import { createFluxAtom } from '@flux/core';

const isOnline$ = createFluxAtom(true);
isOnline$.set(false);
```

## Reading State (Hooks)

### `useFluxValue`

Subscribe to a reactive value. Component re-renders only when the accessed path changes (fine-grained reactivity).

```typescript
import { useFluxValue } from '@flux/core';

const name = useFluxValue(user$.name);         // subscribes to user.name only
const count = useFluxValue(counter$.count);     // subscribes to count only
```

### `useFluxObservable`

Get the observable itself for imperative access.

```typescript
import { useFluxObservable } from '@flux/core';

const obs = useFluxObservable(counter$);
obs.count.set(10);
```

### `useFluxComputed`

Derive computed values that auto-recalculate when dependencies change.

```typescript
import { useFluxComputed } from '@flux/core';

const doubled = useFluxComputed(() => count * 2, [count]);
```

## Actions

### `createAction`

Wraps a function as a named action (currently a pass-through identity).

```typescript
import { createAction } from '@flux/core';
import { counter$ } from './my-stores';

export const increment = createAction(() => {
  counter$.count.set(counter$.count.get() + 1);
});
```

### `createBatchAction`

Wraps multiple state mutations in a single batch, triggering only one re-render.

```typescript
import { createBatchAction } from '@flux/core';

export const addTodo = createBatchAction((text: string) => {
  todos$.all.push({ id: crypto.randomUUID(), text, done: false });
  counter$.count.set(todos$.all.length);
  // Only one re-render despite multiple mutations
});
```

### `batch`

Direct batch function for imperative use.

```typescript
import { batch } from '@flux/core';

batch(() => {
  user$.name.set('Alice');
  user$.age.set(30);
});
```

## Advanced Patterns

### Derived / Computed State

```typescript
import { observable, computed } from '@flux/core';

const store$ = observable({ items: [1, 2, 3, 4, 5] });

// Derived using useFluxComputed in components
function Total() {
  const total = useFluxComputed(() => {
    const items = store$.items.get();
    return items.reduce((a, b) => a + b, 0);
  }, []);
  return <Text>Total: {total}</Text>;
}
```

### Batch Updates

```typescript
batch(() => {
  store$.a.set(1);
  store$.b.set(2);
  store$.c.set(3);
  // Single re-render
});
```

### Nested Objects

```typescript
const profile$ = createKvStore({
  initial: {
    user: {
      name: 'Alice',
      address: { city: 'NYC', zip: '10001' },
    },
  },
  name: 'profile',
});

// Access nested paths
const city = useFluxValue(profile$.user.address.city);
```

### Array State

```typescript
const list$ = createTabularStore<string>({ initial: [], name: 'list' });

list$.all.push('new item');                  // append
list$.all.splice(0, 1);                      // remove first
list$.all.set(['a', 'b', 'c']);              // replace all
```

### Reset State

```typescript
// Re-initialize to original values
const store$ = createKvStore({ initial: { count: 0 }, name: 'counter' });
store$.set({ count: 0 });
```

## Auth System

### Auth Store

```typescript
import { setAuthTokens, setAuthUser, clearAuth } from '@flux/auth-store';
import { useAuth, useUser, useIsAuthenticated, useAuthLoading } from '@flux/auth-hooks';
```

The auth store manages: `user`, `accessToken`, `refreshToken`, `isAuthenticated`, `isLoading`, `error`.

### Auth Hooks

```typescript
function ProfileScreen() {
  const { login, register, logout } = useAuth();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const error = useAuthError();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <LoginForm onSuccess={...} />;

  return <Text>Welcome {user.name}</Text>;
}
```

### `useAuth()` Actions

| Method | Description |
|--------|-------------|
| `login(email, password)` | Authenticate, store tokens, set user |
| `register(name, email, password)` | Create account, store tokens, set user |
| `logout()` | Clear tokens and user state |
| `refresh()` | Refresh access token using refresh token |

## API Client

```typescript
import { api } from '@flux/api-client';

// Typed GET
const user = await api.get<User>('/auth/me');

// Typed POST with body
const result = await api.post<{ token: string }>('/auth/login', {
  email: 'a@b.com',
  password: 'secret',
});

// Typed PUT
await api.put('/user/123', { name: 'New Name' });

// Typed DELETE
await api.delete('/user/123');
```

### Features

- Auto-attaches Bearer token from auth store
- Auto-refreshes on 401 (single retry)
- Typed responses via generics
- Custom `ApiError` class with `status` and `code`

### Custom Requests

```typescript
import { apiClient } from '@flux/api-client';

const data = await apiClient<MyType>('/custom-endpoint', {
  method: 'POST',
  body: JSON.stringify(payload),
  headers: { 'X-Custom': 'value' },
});
```

## File Reference

| File | Exports |
|------|---------|
| `flux/state.ts` | `createTabularStore`, `createKvStore`, `createFluxStore`, `createFluxAtom` |
| `flux/actions.ts` | `createAction`, `createBatchAction`, `batch` |
| `flux/hooks.ts` | `useFluxValue`, `useFluxObservable`, `useFluxComputed` |
| `flux/persistence.ts` | `createSqlitePersistence` (placeholder) |
| `flux/auth-store.ts` | `AuthStateData`, `setAuthTokens`, `setAuthUser`, `setAuthLoading`, `setAuthError`, `clearAuth`, `initializeAuth` |
| `flux/auth-hooks.ts` | `useAuth`, `useUser`, `useIsAuthenticated`, `useAuthLoading`, `useAuthError` |
| `flux/api-client.ts` | `apiClient`, `api`, `ApiError` |
| `flux/index.ts` | Barrel re-export of all above + `observable`, `batch` from legend-state |
