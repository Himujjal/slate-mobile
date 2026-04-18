# Youngerly OpenMAIC API Documentation

This document describes the API endpoints available in the SLATE server-side code. The API is built using Next.js App Router and follows REST and Server-Sent Events (SSE) patterns.

## Base URL
All API routes are prefixed with `/api`.

## Global Headers
Most generation-related endpoints accept the following headers for configuration overrides:

- `x-provider-id`: (Optional) The ID of the primary LLM provider.
- `x-model-id`: (Optional) The specific model ID to use.
- `x-api-key`: (Optional) Client-side API key for the provider.
- `x-base-url`: (Optional) Custom base URL for the provider API.

---

## 1. Orchestration & Chat

### `POST /api/chat`
Stateless chat endpoint for multi-agent interaction.
- **Request Body**: `StatelessChatRequest`
  - `messages`: List of messages in the conversation.
  - `storeState`: Current application state (scenes, currentSceneId, etc.).
  - `config`: Agent IDs and session configuration.
- **Response**: SSE stream (`text/event-stream`).
  - Events: `delta` (text crumbs), `tool-call` (agent actions), `error`.

### `POST /api/generate-classroom`
Initializes a full classroom generation job from user requirements.
- **Request Body**: `GenerateClassroomInput`
  - `requirement`: User's learning objective or topic.
  - `pdfContent`: (Optional) Extracted text from a PDF.
  - `language`: Target language (default: `zh-CN`).
  - `enableWebSearch`, `enableImageGeneration`, `enableVideoGeneration`, `enableTTS`: Boolean flags.
- **Response**: `202 Accepted`
  - `jobId`: The ID of the background job.
  - `pollUrl`: The URL to poll for job status.

### `GET /api/generate-classroom/[jobId]`
Polls the status of a classroom generation job.
- **Response**: `JobStatus`
  - `status`: `pending` | `running` | `succeeded` | `failed`.
  - `step`: Current processing step.
  - `progress`: Percentage complete.
  - `result`: The generated classroom data (if succeeded).

---

## 2. Content Generation Pipeline

### `POST /api/generate/scene-outlines-stream`
Streams the generation of scene outlines (titles, types, and media requests).
- **Request Body**:
  - `requirements`: User requirements (topic, language, etc.).
  - `pdfText`: (Optional) PDF context.
  - `agents`: (Optional) List of agent profiles.
- **Response**: SSE stream.
  - Events: `outline` (individual outline object), `done` (full list), `error`.

### `POST /api/generate/scene-content`
Generates the specific content (slides, quiz questions, interactive elements) for a scene based on its outline.
- **Request Body**:
  - `outline`: The target scene outline.
  - `allOutlines`: Full list of outlines for context.
  - `stageInfo`: Metadata about the course stage.
- **Response**: The generated content object.

### `POST /api/generate/scene-actions`
Generates the sequence of actions (speech, animations, media playback) for a scene.
- **Request Body**:
  - `outline`, `content`: The scene's skeletal structure and generated content.
  - `agents`: Available agent profiles.
  - `previousSpeeches`: Text of speeches from prior scenes for coherence.
- **Response**: The complete `Scene` object with actions.

### `POST /api/generate/agent-profiles`
Generates character profiles (names, roles, personas, avatars) for the simulation.
- **Request Body**:
  - `stageInfo`: Course name and description.
  - `sceneOutlines`: Planned scenes for context.
  - `language`: Target language.
- **Response**: List of `Agent` objects.

---

## 3. Media & Services

### `POST /api/generate/image`
Generates an image from a prompt.
- **Request Body**:
  - `prompt`: Text description.
  - `aspectRatio`: Requested aspect ratio.
- **Response**: `ImageGenerationResult` containing the image URL.

### `POST /api/generate/video`
Generates a short video clip from a prompt.
- **Request Body**:
  - `prompt`: Text description.
  - `duration`: Requested duration in seconds.
- **Response**: `VideoGenerationResult` containing the video URL.

### `POST /api/generate/tts`
Generates Text-to-Speech audio for a string.
- **Request Body**:
  - `text`: The string to speak.
  - `ttsVoice`: The voice ID to use.
  - `ttsProviderId`: The provider (e.g., `openai`, `azure`).
- **Response**: Base64-encoded audio data and format.

### `POST /api/transcription`
Transcribes audio files into text.
- **Request Body**: `multipart/form-data`
  - `audio`: The audio file blob.
  - `providerId`: ASR provider ID.
- **Response**: The transcribed text.

### `POST /api/web-search`
Performs a web search using Exa to provide context for generation.
- **Request Body**:
  - `query`: The search query.
- **Response**: Search results, snippets, and a formatted context string.

---

## 4. Utilities

### `POST /api/parse-pdf`
Extracts text and images from a PDF file.
- **Request Body**: `multipart/form-data`
  - `pdf`: The PDF file blob.
- **Response**: `ParsedPdfContent` (text by page, image metadata).

### `POST /api/quiz-grade`
Grades short-answer (text) quiz questions using an LLM.
- **Request Body**:
  - `question`: The question text.
  - `userAnswer`: The student's answer.
  - `points`: Max points for the question.
- **Response**: `score` and `comment` (feedback).

### `GET /api/server-providers`
Returns a list of all configured and available providers (LLM, TTS, ASR, etc.) on the server.

### `POST /api/proxy-media`
Proxies remote media URLs to bypass browser CORS restrictions.
- **Request Body**: `{ "url": "..." }`
- **Response**: Binary blob of the remote resource.

### `GET /api/health`
Basic health check endpoint. Returns `200 OK` if the server is running.

### `POST /api/classroom`
Persists a generated classroom (stage + scenes) to server-side storage.
- **Response**: The public URL and ID for the persisted classroom.

### `POST /api/verify-model`, `POST /api/verify-image-provider`, `POST /api/verify-video-provider`, `POST /api/verify-pdf-provider`
Endpoints used by the settings UI to verify provider configuration and API keys.
- **Request Body**: Configuration details (apiKey, baseUrl, modelId, etc.).
- **Response**: `200 OK` if valid, or a detailed error message.

### `GET /api/classroom-media/[classroomId]/[...path]`
Serves persisted media and audio files for a specific classroom.
