# Testing

> This document is a reference for all client and server side testing needs

## Overview

- **Test Runner**: Bun's built-in test runner (`bun:test`)
- **Test File Patterns**: `*.test.ts`, `*.spec.ts`, `*_test.ts`, `*_spec.ts`
- **Run tests**: `bun test`

## Client Side (Web)

### Approach: Happy DOM

For lightweight, fast DOM testing, use Happy DOM. It's ~10x faster than jsdom and works seamlessly with Bun.

**Setup**:
```bash
bun add -D happy-dom @happy-dom/global-registrator @testing-library/react @testing-library/jest-dom
```

**Preload setup** (happydom.ts):
```typescript
import { register } from '@happy-dom/global-registrator';

register();
```

**Configure bunfig.toml**:
```toml
[test]
preload = ["./happydom.ts", "./test/setup.ts"]
```

**Example test** (test/client.test.ts):
```typescript
/// <reference lib="dom" />

import { test, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function Button({ children }: { children: React.ReactNode }) {
  return <button>{children}</button>;
}

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

**Notes**:
- Requires `/// <reference lib="dom" />` for TypeScript DOM types
- Use `@testing-library/jest-dom` for DOM-specific matchers

## Server Side

### Approach: Elysia.handle / Elysia.fetch

Elysia provides `Elysia.handle()` and `Elysia.fetch()` methods that accept Web Standard Request and return Response. No server startup required.

**Unit Test Example** (test/server.test.ts):
```typescript
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('returns a response', async () => {
        const app = new Elysia().get('/', () => 'hi')

        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res) => res.text())

        expect(response).toBe('hi')
    })
})
```

**Important**: URLs must be fully valid (e.g., `http://localhost/user`, not `/user`)

### Eden Treaty (Optional)

For end-to-end type-safe testing, use `@elysiajs/eden`:

```bash
bun add @elysiajs/eden
```

```typescript
// test/eden.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', 'hi')
const api = treaty(app)

describe('Elysia', () => {
    it('returns a response', async () => {
        const { data } = await api.hello.get()
        expect(data).toBe('hi')
    })
})
```

## Configuration

Create `bunfig.toml` for test configuration:

```toml
[test]
preload = ["./test/setup.ts"]
timeout = 10000
```

## Run Commands

```bash
bun test                    # Run all tests
bun test --watch          # Watch mode
bun test test/server      # Run specific directory
bun test -t "pattern"   # Filter by test name
```

## Test Scripts

Create `scripts/run-tests.sh` to run both client and server tests:

```bash
#!/bin/bash
set -e

echo "Running client tests..."
bun test test/client

echo "Running server tests..."
bun test test/server

echo "All tests passed!"
```

Or as npm scripts in `package.json`:

```json
{
  "scripts": {
    "test": "bun test",
    "test:client": "bun test test/client",
    "test:server": "bun test test/server",
    "test:watch": "bun test --watch"
  }
}
```

Run:
```bash
bun test           # Run all tests
bun test:client    # Run client tests only
bun test:server    # Run server tests only
bun test --watch   # Watch mode
```

## References

- [Bun Test Runner](https://bun.sh/docs/test)
- [Bun DOM Testing](https://bun.sh/docs/test/dom)
- [Elysia Unit Test](https://elysiajs.com/patterns/unit-test)