import { createSyncedStore } from '@flux/sync';
import type { Observable } from '@legendapp/state';

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  createdAt: number;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const chat$: Observable<ChatMessage[]> = createSyncedStore<ChatMessage>({
  initial: [],
  name: 'chat_messages',
  fetch: async () => {
    const res = await fetch(`${API_BASE_URL}/api/chat/messages`);
    if (!res.ok) {
      throw new Error(`Failed to fetch messages: ${res.statusText}`);
    }
    return res.json();
  },
  create: async (message) => {
    const res = await fetch(`${API_BASE_URL}/api/chat/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      throw new Error(`Failed to create message: ${res.statusText}`);
    }
    return res.json();
  },
  subscribe: (params) => {
    const url = `${API_BASE_URL}/api/chat/stream`;
    let eventSource: EventSource | null = null;
    let closed = false;

    function connect() {
      if (closed) return;
      eventSource = new EventSource(url);

      eventSource.addEventListener('message', (event: MessageEvent) => {
        try {
          const newMessage = JSON.parse(event.data) as ChatMessage;
          const current = params.value$.peek() as ChatMessage[];
          params.update({ value: [...current, newMessage] });
        } catch {
          params.onError(new Error('Failed to parse SSE message'));
        }
      });

      eventSource.onerror = () => {
        eventSource?.close();
        if (!closed) {
          setTimeout(connect, 3000);
        }
      };
    }

    connect();

    return () => {
      closed = true;
      eventSource?.close();
    };
  },
});
