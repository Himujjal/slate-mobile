# Flux

Flux is the infrastructure layer that handles **state, persistence, auth, and sync** all in one.
It wraps Legend-State with typed utilities, auto-persistence, auth primitives, and an
authenticated API client — so the app layer never worries about tokens, KV writes, or
server communication.

## What Flux Handles

| Concern | How |
|---|---|
| **State** | Legend-State observables via `createFluxStore`, `createKvStore`, `createTabularStore`, `createFluxAtom` |
| **Persistence** | Automatic via `ObservablePersistFlux` — stores with a `name` auto-persist to KV storage |
| **Auth** | Built-in `useAuth()`, `useUser()`, `useIsAuthenticated()` hooks + OTP/Apple login |
| **API** | `api.get/post/put/delete` — auto-attaches Bearer token, auto-refreshes on 401 |

## Store Types

### Tabular Store
JSON arrays serialized/deserialized from SQLite. Use for collections of records.

```ts
import { createTabularStore } from '@flux';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const todos$ = createTabularStore<Todo[]>({
  initial: [],
  name: 'todos', // optional persistence name
});
```

### KV Store
Key-value store using SQLite (RN) or LocalStorage (web).

```ts
import { createKvStore } from '@flux';

interface Settings {
  theme: 'light' | 'dark';
  fontSize: number;
}

export const settings$ = createKvStore<Settings>({
  initial: { theme: 'light', fontSize: 14 },
  name: 'settings',
});
```

## Usage

### Auth (flux primitives — use directly)

```ts
import { useAuth, useUser, useIsAuthenticated } from '@flux';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  // Tokens, persistence, refresh — all handled by flux.
}
```

### App Stores (define in app/state/)

Flux provides the store creators. App-specific data stores are defined in `app/state/`:

```ts
// app/state.ts
import { createTabularStore } from '@flux';

interface AppState {
  user: { name: string } | null;
}

export const store$ = createTabularStore<AppState>({
  initial: { user: null },
});

// Use in components:
// import { store$ } from '@/app/state';
// const user = useFluxValue(store$.user);
```

### API Client (authenticated requests)

```ts
import { api } from '@flux/api-client';

const posts = await api.get<Post[]>('/posts');
await api.post('/posts', { title: 'Hello' });
// Auth tokens and 401 refresh handled automatically.
```

## Store Types (details)

## Actions

Actions modify state.

### createAction
Simple action wrapper (pass-through).

```ts
import { createAction } from '@flux';

const toggleTodo = createAction((id: number) => {
  const todo = todos$.todos.find((t) => t.id === id);
  todo?.completed.set((prev) => !prev);
});
```

### createBatchAction
For multiple updates - triggers single re-render.

```ts
import { createBatchAction } from '@flux';

const addTodo = createBatchAction((text: string) => {
  todos$.todos.push({ id: Date.now(), text, completed: false });
});

// Call as: addTodo('Buy milk');
```

Or use `batch` directly for complex operations:

```ts
batch(() => {
  store$.count.set(1);
  store$.name.set('updated');
});
```

## Hooks

### useFluxValue
Track observable changes and re-render on change.

```ts
const user = useFluxValue(store$.user);
const isDark = useFluxValue(() => store$.theme.get() === 'dark');
```

### useFluxObservable
Create local component state.

```ts
const local$ = useFluxObservable({ count: 0 });
const value = useFluxValue(local$.count);
```

### observer
Merge multiple useFluxValue calls into single hook for performance.

```tsx
const Component = observer(() => {
  const a = useFluxValue(store$.a);
  const b = useFluxValue(store$.b);
  return <Text>{a} {b}</Text>;
});
```

## Files

- `state.ts` — Store creators (`createTabularStore`, `createKvStore`, `createFluxStore`, `createFluxAtom`)
- `actions.ts` — Action helpers (`createAction`, `createBatchAction`)
- `hooks.ts` — React hooks (`useFluxValue`, `useFluxObservable`, `useFluxComputed`, `observer`)
- `persistence.ts` — `ObservablePersistFlux` plugin (auto-persists stores to KV storage)
- `auth-store.ts` — Auth state observable (user, tokens, loading, error)
- `auth-hooks.ts` — Auth React hooks (`useAuth`, `useUser`, `useIsAuthenticated`) + login/logout API
- `api-client.ts` — Authenticated HTTP client with auto 401 → refresh → retry
- `index.ts` — Barrel export
