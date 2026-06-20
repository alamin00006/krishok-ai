export type ScreenName = 'chat' | 'crops' | 'diseases' | 'account' | 'detail';

export type Question = {
  id: string;
  text: string;
  imageUrl?: string | null;
  aiAnswer?: string | null;
  createdAt?: string;
};

export type ConversationSummary = {
  id: string;
  title: string;
  userId: string;
  updatedAt: string;
  _count: { questions: number };
};

export type Conversation = ConversationSummary & { questions: Question[] };

export type User = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  _count?: { questions: number; conversations: number };
};

export type ContentItem = {
  id: string;
  name: string;
  category: string;
  image: string;
  summary: string;
  stats: Array<{ label: string; value: string }>;
  sections: Array<{ title: string; items: string[] }>;
  alert: string;
  season?: string;
  duration?: string;
  severity?: string;
};

export type ContentResponse = {
  crops: ContentItem[];
  diseases: ContentItem[];
};

export type PickedImage = { uri: string; name: string; type: string };
