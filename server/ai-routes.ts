import { Elysia } from 'elysia';
import { t } from 'elysia';

const LLM_API_URL = process.env.LLM_API_URL || 'https://api.openai.com/v1';

const rateLimitStore: Map<string, number> = new Map();

const llmRateLimiter = () =>
  new Elysia().on('beforeHandle', ({ headers, path }) => {
    if (path !== '/api/llm') return;
    const clientId =
      headers.authorization || headers['x-forwarded-for'] || 'anonymous';
    const key = `ratelimit:${clientId}`;
    const now = Date.now();
    const lastRequest = rateLimitStore.get(key) || 0;
    if (now - lastRequest <= 1000) {
      return new Response('Rate limited', { status: 429 });
    }
    rateLimitStore.set(key, now);
  });

interface AuthState {
  isAuthenticated: boolean;
  authCheckTime: number;
}

const llmAuthChecker = () =>
  new Elysia().derive(({ headers, store }) => {
    const authHeader = headers.authorization;
    const isAuthenticated = authHeader?.startsWith('Bearer ') ?? false;
    const authCheckTime = ((store as Record<string, unknown>).authCheckTime as number) || Date.now();
    return { isAuthenticated, authCheckTime };
  });

export const aiRoutes = new Elysia({ prefix: '/api' })
  .use(llmRateLimiter())
  .use(llmAuthChecker())
  .derive(({ store }) => {
    const authState = (store as Record<string, unknown>).authState as AuthState | undefined;
    return {
      isAuthenticated: authState?.isAuthenticated ?? false,
      authCheckTime: authState?.authCheckTime ?? Date.now(),
    };
  })
  .post(
    '/llm',
    async ({ body, headers, isAuthenticated: isAuth, store }) => {
      if (!isAuth) {
        return new Response('Unauthorized', { status: 401 });
      }

      const authState = store as unknown as AuthState;
      const authCheckTime = authState?.authCheckTime || Date.now();
      if (Date.now() - authCheckTime > 5000) {
        return new Response('Auth expired', { status: 401 });
      }

      const providerId = headers['x-provider-id'];
      const modelId = headers['x-model-id'];
      const apiKey = headers['x-api-key'];
      const baseUrl = headers['x-base-url'];

      const targetUrl = baseUrl || `${LLM_API_URL}/chat/completions`;

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey ? `Bearer ${apiKey}` : '',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    },
    {
      body: t.Any(),
    }
  )
  .post(
    '/generate/image',
    async ({ body }) => {
      const { prompt, aspectRatio } = body as {
        prompt: string;
        aspectRatio?: string;
      };
      return { imageUrl: '', error: 'Not implemented' };
    },
    {
      body: t.Object({
        prompt: t.String(),
        aspectRatio: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/generate/video',
    async ({ body }) => {
      const { prompt, duration } = body as {
        prompt: string;
        duration?: number;
      };
      return { videoUrl: '', error: 'Not implemented' };
    },
    {
      body: t.Object({
        prompt: t.String(),
        duration: t.Optional(t.Number()),
      }),
    }
  )
  .post(
    '/generate/tts',
    async ({ body }) => {
      const { text, ttsVoice, ttsProviderId } = body as {
        text: string;
        ttsVoice?: string;
        ttsProviderId?: string;
      };
      return { audio: '', format: 'mp3', error: 'Not implemented' };
    },
    {
      body: t.Object({
        text: t.String(),
        ttsVoice: t.Optional(t.String()),
        ttsProviderId: t.Optional(t.String()),
      }),
    }
  )
  .post('/transcription', async ({ request }) => {
    const formData = await request.formData();
    const fd = formData as unknown as { get: (name: string) => unknown };
    const audio = fd.get('audio');
    const providerId = fd.get('providerId');
    return { text: '', error: 'Not implemented' };
  })
  .post(
    '/web-search',
    async ({ body }) => {
      const { query } = body as { query: string };
      return { results: [], context: '', error: 'Not implemented' };
    },
    {
      body: t.Object({
        query: t.String(),
      }),
    }
  );

export type AiRoutes = typeof aiRoutes;