import { Elysia, t } from 'elysia';

export const orchestrationRoutes = new Elysia({ prefix: '/api' })
  .post(
    '/chat',
    async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              'event: delta\ndata: {"content": "Not implemented"}\n\n'
            )
          );
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    },
    {
      body: t.Object({
        messages: t.Array(
          t.Object({
            role: t.String(),
            content: t.String(),
          })
        ),
        storeState: t.Record(t.String(), t.Unknown()),
        config: t.Optional(t.Record(t.String(), t.Unknown())),
      }),
    }
  )
  .post(
    '/generate-classroom',
    async () => {
      const jobId = crypto.randomUUID();
      return {
        jobId,
        pollUrl: `/api/generate-classroom/${jobId}`,
      };
    },
    {
      body: t.Object({
        requirement: t.String(),
        pdfContent: t.Optional(t.String()),
        language: t.Optional(t.String()),
        enableWebSearch: t.Optional(t.Boolean()),
        enableImageGeneration: t.Optional(t.Boolean()),
        enableVideoGeneration: t.Optional(t.Boolean()),
        enableTTS: t.Optional(t.Boolean()),
      }),
    }
  )
  .get(
    '/generate-classroom/:jobId',
    async () => {
      return {
        status: 'pending',
        step: '',
        progress: 0,
        result: null,
      };
    },
    {
      params: t.Object({
        jobId: t.String(),
      }),
    }
  );

export type OrchestrationRoutes = typeof orchestrationRoutes;
