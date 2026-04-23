import { Elysia } from 'elysia';
import { t } from 'elysia';

export const utilityRoutes = new Elysia({ prefix: '/api' })
  .get('/health', () => ({ status: 'ok' }))
  .post('/parse-pdf', async ({ request }) => {
    const formData = await request.formData();
    const fd = formData as unknown as { get: (name: string) => unknown };
    const pdf = fd.get('pdf');
    return { text: [], images: [], error: 'Not implemented' };
  })
  .post(
    '/quiz-grade',
    async ({ body }) => {
      const { question, userAnswer, points } = body as {
        question: string;
        userAnswer: string;
        points: number;
      };
      return { score: 0, comment: '', error: 'Not implemented' };
    },
    {
      body: t.Object({
        question: t.String(),
        userAnswer: t.String(),
        points: t.Number(),
      }),
    }
  )
  .get('/server-providers', () => ({ providers: [], error: 'Not implemented' }))
  .post(
    '/proxy-media',
    async ({ body }) => {
      const { url } = body as { url: string };
      return { error: 'Not implemented' };
    },
    {
      body: t.Object({
        url: t.String(),
      }),
    }
  )
  .post(
    '/classroom',
    async ({ body }) => {
      const { stage, scenes } = body as {
        stage: Record<string, unknown>;
        scenes: Array<Record<string, unknown>>;
      };
      return { id: '', url: '', error: 'Not implemented' };
    },
    {
      body: t.Object({
        stage: t.Record(t.String(), t.Unknown()),
        scenes: t.Array(t.Record(t.String(), t.Unknown())),
      }),
    }
  )
  .post(
    '/verify-model',
    async ({ body }) => {
      const { apiKey, baseUrl, modelId } = body as {
        apiKey: string;
        baseUrl?: string;
        modelId?: string;
      };
      return { valid: false, error: 'Not implemented' };
    },
    {
      body: t.Object({
        apiKey: t.String(),
        baseUrl: t.Optional(t.String()),
        modelId: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/verify-image-provider',
    async ({ body }) => {
      const { apiKey, baseUrl } = body as {
        apiKey: string;
        baseUrl?: string;
      };
      return { valid: false, error: 'Not implemented' };
    },
    {
      body: t.Object({
        apiKey: t.String(),
        baseUrl: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/verify-video-provider',
    async ({ body }) => {
      const { apiKey, baseUrl } = body as {
        apiKey: string;
        baseUrl?: string;
      };
      return { valid: false, error: 'Not implemented' };
    },
    {
      body: t.Object({
        apiKey: t.String(),
        baseUrl: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/verify-pdf-provider',
    async ({ body }) => {
      const { apiKey, baseUrl } = body as {
        apiKey: string;
        baseUrl?: string;
      };
      return { valid: false, error: 'Not implemented' };
    },
    {
      body: t.Object({
        apiKey: t.String(),
        baseUrl: t.Optional(t.String()),
      }),
    }
  );

export type UtilityRoutes = typeof utilityRoutes;
