# Axion Documentation

The framework for building production-grade mobile and web applications with Expo + React Native.

## Module Structure

```
axion/
├── app/               # YOUR APP - Expo Router pages (dynamic)
├── ui/                # UI component library (copy-pasteable)
├── flux/              # State management (copy-pasteable)
├── server/            # Bun/Elysia API server (copy-pasteable)
├── storage/           # Storage utilities (copy-pasteable)
├── constants/         # App constants (copy-pasteable)
├── hooks/             # Custom hooks (copy-pasteable)
├── assets/            # Images, fonts, etc.
├── docs/              # Documentation
└── scripts/           # Build scripts
```

## Quick Start

```bash
npm install
npm run dev          # Runs Expo + Server concurrently
npm run web          # Web only
npm run lint         # Biome check
npm run lint:fix     # Biome auto-fix
```

## Architecture

**Only `app/` is dynamic** - everything else is ready-to-use infrastructure:

| Layer | Module | Purpose |
|-------|--------|---------|
| UI Components | `@ui/*` | 20+ reusable components (Button, Card, Modal, etc.) |
| State | `@flux/*` | Legend-State stores, actions, hooks, auth, API client |
| Storage | `@storage/*` | MMKV/localStorage cross-platform KV + token storage |
| Server | `server/` | Bun/Elysia API with auth, AI, content routes |
| App | `@app/*` | Your expo-router pages and features |

## Documentation Modules

| Doc | Description |
|-----|-------------|
| [Architecture](./architecture.md) | System architecture, module design, data flow |
| [Flux](./flux.md) | State management: stores, actions, hooks, auth, API client |
| [UI](./ui.md) | UI component library: components, theme, patterns |
| [Storage](./storage.md) | KV storage, token storage |
| [Server](./server.md) | Elysia server: routes, middleware, auth |
| [Auth](./auth.md) | Authentication system (full walkthrough) |
| [App Guide](./app-guide.md) | Building features in `app/` with expo-router |

## Commands

```bash
npm run dev           # Start Expo + Server concurrently
npm run dev:server    # Start server only
npm run dev:expo      # Start Expo only
npm run android       # Run on Android
npm run ios           # Run on iOS
npm run web           # Run on web
npm run lint          # Biome check
npm run lint:fix      # Biome auto-fix
npm run format        # Biome format
npm run typecheck     # TypeScript check
npm run check-all     # Lint + typecheck + commitlint
```
