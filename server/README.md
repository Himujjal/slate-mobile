# Slate Server

Elysia.js API server for the Slate application.

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Start production server
bun run start
```

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run start` | Start production server |
| `bun run lint` | Run Biome check |
| `bun run lint:fix` | Run Biome check with auto-fix |

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Orchestration
- `POST /api/chat` - Multi-agent chat (SSE)
- `POST /api/generate-classroom` - Start classroom generation (returns jobId)
- `GET /api/generate-classroom/:jobId` - Poll job status

### Content Generation
- `POST /api/generate/scene-outlines-stream` - Generate scene outlines (SSE)
- `POST /api/generate/scene-content` - Generate scene content
- `POST /api/generate/scene-actions` - Generate scene actions
- `POST /api/generate/agent-profiles` - Generate agent profiles

### Media Generation
- `POST /api/generate/image` - Generate image
- `POST /api/generate/video` - Generate video
- `POST /api/generate/tts` - Generate text-to-speech

### Utilities
- `GET /api/health` - Health check
- `POST /api/parse-pdf` - Parse PDF
- `POST /api/quiz-grade` - Grade quiz answers
- `GET /api/server-providers` - List available providers
- `POST /api/proxy-media` - Proxy remote media

### AI Proxy
- `POST /api/llm` - Proxy LLM requests (rate limited)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `LLM_API_URL` | LLM API base URL | `https://api.openai.com/v1` |

## Global Headers

Some endpoints accept these headers for configuration overrides:
- `x-provider-id` - Primary LLM provider ID
- `x-model-id` - Specific model ID
- `x-api-key` - Client-side API key
- `x-base-url` - Custom base URL

## Development

```bash
# Run lint checks
bun run lint

# Fix lint issues
bun run lint:fix
```

## Architecture

The server uses a flat route structure with modular route files:
- `auth-route.ts` - Authentication
- `ai-routes.ts` - AI/LLM generation
- `orchestration-routes.ts` - Chat & classroom generation
- `content-routes.ts` - Content generation
- `utility-routes.ts` - Utility endpoints
- `middlewares.ts` - Shared middleware
- `utils/` - Utility functions