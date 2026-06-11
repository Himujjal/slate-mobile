import { Elysia, t } from 'elysia';
import { table } from '../storage';

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  createdAt: number;
  [key: string]: unknown;
}

const sseClients = new Map<string, (message: ChatMessage) => void>();

function broadcastMessage(message: ChatMessage): void {
  for (const send of sseClients.values()) {
    try {
      send(message);
    } catch {
      // Client might have disconnected
    }
  }
}

export const chatRoutes = new Elysia({ prefix: '/api/chat' })
  .get('/messages', () => {
    return table.findAll<ChatMessage>('chat_messages');
  })
  .post(
    '/messages',
    async ({ body }) => {
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content: body.content,
        userId: body.userId,
        username: body.username,
        createdAt: Date.now(),
      };
      table.insert('chat_messages', message);
      broadcastMessage(message);
      return message;
    },
    {
      body: t.Object({
        content: t.String(),
        userId: t.String(),
        username: t.String(),
      }),
    }
  )
  .get('/stream', () => {
    const encoder = new TextEncoder();
    const clientId = crypto.randomUUID();
    const stream = new ReadableStream({
      start(controller) {
        sseClients.set(clientId, (message: ChatMessage) => {
          controller.enqueue(
            encoder.encode(
              `event: message\ndata: ${JSON.stringify(message)}\n\n`
            )
          );
        });
      },
      cancel() {
        sseClients.delete(clientId);
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  });

export type ChatRoutes = typeof chatRoutes;
