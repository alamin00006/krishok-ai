import type {
  ContentItem,
  ContentResponse,
  Conversation,
  ConversationSummary,
  PickedImage,
  Question,
  User,
} from './types';

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://10.0.2.2:5000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data?.message === 'string' ? data.message : 'সার্ভারে সমস্যা হয়েছে।',
    );
  }
  return data as T;
}

function appendImage(body: FormData, image?: PickedImage | null) {
  if (image) body.append('image', image as unknown as Blob);
}

export const api = {
  register: (body: { name: string; phone: string; password: string }) =>
    request<User>('/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  login: (body: { phone: string; password: string }) =>
    request<User>('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  user: (id: string) => request<User>(`/users/${id}`),
  content: () => request<ContentResponse>('/content'),
  contentDetail: (section: string, id: string) =>
    request<ContentItem>(`/content/${section}/${id}`),
  conversations: (userId: string) =>
    request<ConversationSummary[]>(
      `/conversations?userId=${encodeURIComponent(userId)}`,
    ),
  conversation: (id: string, userId: string) =>
    request<Conversation>(
      `/conversations/${id}?userId=${encodeURIComponent(userId)}`,
    ),
  createConversation: (userId: string, title: string) =>
    request<Conversation>('/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title }),
    }),
  guestQuestions: (guestId: string) =>
    request<{ questions: Question[]; used: number; limit: number; remaining: number }>(
      `/questions?guestId=${encodeURIComponent(guestId)}`,
    ),
  sendGuestQuestion: (guestId: string, text: string, image?: PickedImage | null) => {
    const body = new FormData();
    body.append('guestId', guestId);
    body.append('text', text);
    appendImage(body, image);
    return request<Question>('/questions', { method: 'POST', body });
  },
  sendMessage: (
    conversationId: string,
    userId: string,
    text: string,
    image?: PickedImage | null,
  ) => {
    const body = new FormData();
    body.append('userId', userId);
    body.append('text', text);
    appendImage(body, image);
    return request<Question>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body,
    });
  },
};
