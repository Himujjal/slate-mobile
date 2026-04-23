# Slate Server - Agent Guidelines

This document provides guidelines for agents working on the Slate server codebase.

## Project Overview

Slate server is an Elysia.js (Bun) API server that provides:
- Multi-agent chat orchestration
- Classroom/scenario generation pipeline
- Media generation (image, video, TTS)
- Transcription and web search services
- Utility endpoints (PDF parsing, quiz grading, etc.)

## Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: Kysely (SQL query builder)
- **Linting**: Biome

## Code Style Guidelines

### General Rules

- Use TypeScript with strict mode
- All code must pass Biome linting (`npm run lint`)
- Format all files before committing (`npm run lint:fix`)

### TypeScript

- Enable strict mode in tsconfig.json
- Prefer explicit types over `any`
- Use `type` for unions/intersections, `interface` for objects

### Naming Conventions

- **Files**: kebab-case (e.g., `auth-route.ts`, `ai-routes.ts`)
- **Functions**: camelCase (e.g., `orchestrationRoutes`)
- **Types/Interfaces**: PascalCase (e.g., `AuthRoutes`)

### Imports

- Use relative imports for local modules
- Organize: external libraries → internal modules

Example:
```typescript
import { Elysia } from 'elysia';
import { t } from 'elysia';
import { rateLimiter, authChecker } from './middlewares';
import { someLocalHandler } from './utils/handlers';
```

### Routes Pattern

Routes follow this pattern:

```typescript
import { Elysia } from 'elysia';
import { t } from 'elysia';

export const exampleRoutes = new Elysia({ prefix: '/api' })
  .post('/endpoint', async ({ body, params, query }) => {
    // Implementation
    return { result: 'data' };
  }, {
    body: t.Object({
      field: t.String(),
    }),
    params: t.Object({
      id: t.String(),
    }),
  });

export type ExampleRoutes = typeof exampleRoutes;
```

### State Management

- Use Elysia's built-in `.derive()` for request-scoped state
- Use `.store` for application-scoped state
- Avoid global variables

### Error Handling

- Return meaningful error messages
- Use proper HTTP status codes
- Include error details in response

## File Structure

```
server/
├── index.ts             # Main entry point
├── auth-route.ts         # Authentication routes
├── ai-routes.ts          # AI/LLM generation routes
├── orchestration-routes.ts  # Chat & classroom generation
├── content-routes.ts    # Content generation pipeline
├── utility-routes.ts    # Utility endpoints
├── middlewares.ts        # Shared middleware
├── utils/
│   └── db-setup.ts       # Database setup
├── api.md               # API documentation
├── README.md            # Server README
├── AGENTS.md            # This file
└── package.json         # Dependencies
```

## Conventions

### Route Prefixes

- `/api` - All API endpoints
- `/auth` - Authentication endpoints
- `/api/generate/*` - Generation endpoints

### Response Types

- REST endpoints return JSON
- Streaming endpoints return SSE (`text/event-stream`)
- Binary endpoints return appropriate content types

### Rate Limiting

- Use `@elysiajs/rate-limit` for rate limiting
- Configure per-route or globally

### Authentication

- Use Bearer token in Authorization header
- Check auth in middleware/derive

### Environment Variables

Required:
- `LLM_API_URL` - LLM API base URL (default: `https://api.openai.com/v1`)

Optional:
- Database connection string
- Other provider API keys