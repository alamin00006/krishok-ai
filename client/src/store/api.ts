import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Question {
  id: string | number;
  text: string;
  imageUrl?: string | null;
  aiAnswer?: string | null;
  createdAt?: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  questions: Array<Pick<Question, "text" | "createdAt">>;
  _count: { questions: number };
}

export interface Conversation extends Omit<ConversationSummary, "questions"> {
  questions: Question[];
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  _count?: { questions: number; conversations: number };
}

export type RegisterInput = Pick<UserProfile, "name" | "phone"> & {
  password: string;
};

export interface GuestQuestions {
  questions: Question[];
  used: number;
  limit: number;
  remaining: number;
}

export interface ContentStat {
  label: string;
  value: string;
}

export interface ContentBlock {
  title: string;
  items: string[];
}

export interface ContentItem {
  id: string;
  name: string;
  category: string;
  image: string;
  summary: string;
  stats: ContentStat[];
  sections: ContentBlock[];
  alert: string;
  season?: string;
  duration?: string;
  water?: string;
  sun?: string;
  severity?: string;
  price?: string;
  change?: string;
}

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/?$/, "/") ?? "http://localhost:5000/";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  tagTypes: ["Questions", "Users", "Conversations"],
  endpoints: (builder) => ({
    getGuestQuestions: builder.query<GuestQuestions, string>({
      query: (guestId) => `questions?guestId=${encodeURIComponent(guestId)}`,
      providesTags: ["Questions"],
    }),
    createGuestQuestion: builder.mutation<
      Question,
      { guestId: string; text: string; image?: File | null }
    >({
      query: ({ guestId, text, image }) => {
        const formData = new FormData();
        formData.append("guestId", guestId);
        formData.append("text", text);
        if (image) formData.append("image", image);
        return {
          url: "questions",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Questions"],
    }),
    getContentDetail: builder.query<ContentItem, { section: string; id: string }>({
      query: ({ section, id }) => `content/${section}/${id}`,
    }),
    getUser: builder.query<UserProfile, string>({
      query: (id) => `users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
    registerUser: builder.mutation<UserProfile, RegisterInput>({
      query: (body) => ({ url: "users/register", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),
    loginUser: builder.mutation<
      UserProfile,
      { phone: string; password: string }
    >({
      query: (body) => ({ url: "users/login", method: "POST", body }),
    }),
    updateUser: builder.mutation<UserProfile, { id: string; body: { name: string } }>({
      query: ({ id, body }) => ({ url: `users/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Users", id }],
    }),
    getConversations: builder.query<ConversationSummary[], string>({
      query: (userId) => `conversations?userId=${encodeURIComponent(userId)}`,
      providesTags: ["Conversations"],
    }),
    getConversation: builder.query<
      Conversation,
      { id: string; userId: string }
    >({
      query: ({ id, userId }) =>
        `conversations/${id}?userId=${encodeURIComponent(userId)}`,
      providesTags: (_result, _error, { id }) => [
        { type: "Conversations", id },
      ],
    }),
    createConversation: builder.mutation<
      Conversation,
      { userId: string; title?: string }
    >({
      query: (body) => ({ url: "conversations", method: "POST", body }),
      invalidatesTags: ["Conversations"],
    }),
    sendConversationMessage: builder.mutation<
      Question,
      { conversationId: string; userId: string; text: string; image?: File | null }
    >({
      query: ({ conversationId, userId, text, image }) => {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("text", text);
        if (image) formData.append("image", image);
        return {
          url: `conversations/${conversationId}/messages`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { conversationId }) => [
        "Conversations",
        { type: "Conversations", id: conversationId },
      ],
    }),
    deleteConversation: builder.mutation<
      { success: boolean },
      { id: string; userId: string }
    >({
      query: ({ id, userId }) => ({
        url: `conversations/${id}?userId=${encodeURIComponent(userId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useGetGuestQuestionsQuery,
  useCreateGuestQuestionMutation,
  useGetContentDetailQuery,
  useGetUserQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useGetConversationsQuery,
  useGetConversationQuery,
  useCreateConversationMutation,
  useSendConversationMessageMutation,
  useDeleteConversationMutation,
} = api;
