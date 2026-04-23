import { Elysia } from 'elysia';
import { t } from 'elysia';

export const contentRoutes = new Elysia({ prefix: '/api' })
  .post(
    '/generate/scene-outlines-stream',
    async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('event: done\ndata: []\n\n'));
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
        requirements: t.Record(t.String(), t.Unknown()),
        pdfText: t.Optional(t.String()),
        agents: t.Optional(t.Array(t.Record(t.String(), t.Unknown()))),
      }),
    }
  )
  .post(
    '/generate/scene-content',
    async () => {
      return { content: null, error: 'Not implemented' };
    },
    {
      body: t.Object({
        outline: t.Record(t.String(), t.Unknown()),
        allOutlines: t.Array(t.Record(t.String(), t.Unknown())),
        stageInfo: t.Record(t.String(), t.Unknown()),
      }),
    }
  )
  .post(
    '/generate/scene-actions',
    async () => {
      return { scene: null, error: 'Not implemented' };
    },
    {
      body: t.Object({
        outline: t.Record(t.String(), t.Unknown()),
        content: t.Record(t.String(), t.Unknown()),
        agents: t.Array(t.Record(t.String(), t.Unknown())),
        previousSpeeches: t.Array(t.String()),
      }),
    }
  )
  .post(
    '/generate/agent-profiles',
    async () => {
      return { agents: [], error: 'Not implemented' };
    },
    {
      body: t.Object({
        stageInfo: t.Record(t.String(), t.Unknown()),
        sceneOutlines: t.Array(t.Record(t.String(), t.Unknown())),
        language: t.String(),
      }),
    }
  );

export type ContentRoutes = typeof contentRoutes;
