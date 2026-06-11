import { beforeEach, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { chatRoutes } from '../../server/chat-routes';
import type { ChatMessage } from '../../server/chat-routes';
import {
  MemoryKvAdapter,
  MemoryTableAdapter,
  setKvAdapter,
  setTableAdapter,
  table,
} from '../../storage';

function createTestApp() {
  return new Elysia().use(chatRoutes);
}

describe('Chat Routes', () => {
  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
    setTableAdapter(new MemoryTableAdapter());
  });

  describe('GET /api/chat/messages', () => {
    it('should return empty array when no messages', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/api/chat/messages')
      );
      expect(response.status).toBe(200);
      const data = (await response.json()) as ChatMessage[];
      expect(data).toEqual([]);
    });

    it('should return stored messages', async () => {
      const msg: ChatMessage = {
        id: '1',
        content: 'Hello',
        userId: 'u1',
        username: 'Alice',
        createdAt: Date.now(),
      };
      table.insert('chat_messages', msg);

      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/api/chat/messages')
      );
      expect(response.status).toBe(200);
      const data = (await response.json()) as ChatMessage[];
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe('1');
      expect(data[0].content).toBe('Hello');
    });
  });

  describe('POST /api/chat/messages', () => {
    it('should create a message', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: 'Hello world',
            userId: 'u1',
            username: 'Bob',
          }),
        })
      );
      expect(response.status).toBe(200);
      const data = (await response.json()) as ChatMessage;
      expect(data.content).toBe('Hello world');
      expect(data.userId).toBe('u1');
      expect(data.username).toBe('Bob');
      expect(data.id).toBeDefined();
      expect(data.createdAt).toBeGreaterThan(0);
    });

    it('should persist the message to the table', async () => {
      const app = createTestApp();
      await app.handle(
        new Request('http://localhost:3000/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: 'Persist me',
            userId: 'u1',
            username: 'Bob',
          }),
        })
      );
      const stored = table.findAll<ChatMessage>('chat_messages');
      expect(stored).toHaveLength(1);
      expect(stored[0].content).toBe('Persist me');
    });

    it('should reject missing fields', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: 'missing fields' }),
        })
      );
      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/chat/stream (SSE)', () => {
    it('should return an SSE response', async () => {
      const app = createTestApp();
      const response = await app.handle(
        new Request('http://localhost:3000/api/chat/stream')
      );
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      expect(response.headers.get('Cache-Control')).toBe('no-cache');
    });

    it('should deliver events when messages are posted', async () => {
      const app = createTestApp();
      const streamResponse = await app.handle(
        new Request('http://localhost:3000/api/chat/stream')
      );
      const reader = streamResponse.body?.getReader();
      expect(reader).toBeDefined();

      await app.handle(
        new Request('http://localhost:3000/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: 'SSE test',
            userId: 'u1',
            username: 'Eve',
          }),
        })
      );

      const result = await reader?.read();
      const text = new TextDecoder().decode(result?.value);
      expect(text).toContain('event: message');
      expect(text).toContain('SSE test');
      expect(text).toContain('Eve');

      reader?.cancel();
    });
  });
});
