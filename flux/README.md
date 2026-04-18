# Flux

Flux is a cross-platform state management library. It wraps Legend-State with typed utilities and SQLite persistence.

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

Flux is a **library** - do not write app state here. Define your app schema in `app/` directory:

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
// const user = useValue(store$.user);
```

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

- `state.ts` - Store creators (`createTabularStore`, `createKvStore`, `createFluxAtom`)
- `actions.ts` - Action helpers (`createAction`, `createBatchAction`)
- `hooks.ts` - React hooks (`useFluxValue`, `useFluxObservable`, `useFluxComputed`)
- `persistence.ts` - SQLite persistence (reserved)
- `index.ts` - Barrel export
