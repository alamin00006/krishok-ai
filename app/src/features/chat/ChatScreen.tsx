import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../api';
import { Header, IconButton, getError } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import type { ConversationSummary, Feedback, PickedImage, Question } from '../../types';
import { ChatComposer } from './ChatComposer';
import { HistoryDrawer } from './HistoryDrawer';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';

export function ChatScreen({ onAccount }: { onAccount: () => void }) {
  const { theme, dark, toggleTheme, userId, guestId } = useApp();
  const [messages, setMessages] = useState<Question[]>([]);
  const [threads, setThreads] = useState<ConversationSummary[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [title, setTitle] = useState('Krishok.ai সহকারী');
  const [text, setText] = useState('');
  const [image, setImage] = useState<PickedImage | null>(null);
  const [remaining, setRemaining] = useState(5);
  const [sending, setSending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<Question | null>(null);
  const [drawer, setDrawer] = useState(false);
  const listRef = useRef<FlatList<Question>>(null);

  const load = useCallback(async () => {
    try {
      if (userId) {
        setThreads(await api.conversations(userId));
        if (threadId) {
          const conversation = await api.conversation(threadId, userId);
          setMessages(conversation.questions);
          setTitle(conversation.title);
        } else {
          setMessages([]);
          setTitle('নতুন কৃষি আলোচনা');
        }
      } else {
        const result = await api.guestQuestions(guestId);
        setMessages(result.questions);
        setRemaining(result.remaining);
        setThreads([]);
        setTitle('Krishok.ai সহকারী');
      }
    } catch (error) {
      Alert.alert('তথ্য আনা যায়নি', getError(error));
    }
  }, [guestId, threadId, userId]);

  useEffect(() => void load(), [load]);

  const send = async () => {
    const clean = text.trim() || (image ? 'এই ছবির সমস্যা শনাক্ত করে করণীয় বলুন।' : '');
    if (!clean || sending) return;
    const pending: Question = {
      id: `pending-${Date.now()}`,
      text: clean,
      imageUrl: image?.uri,
    };
    setText('');
    setPendingMessage(pending);
    setSending(true);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    try {
      let answer: Question;
      if (userId) {
        let active = threadId;
        if (!active) {
          const conversation = await api.createConversation(userId, clean);
          active = conversation.id;
          setThreadId(active);
          setTitle(conversation.title);
        }
        answer = await api.sendMessage(active, userId, clean, image);
        void api.conversations(userId).then(setThreads).catch(() => undefined);
      } else {
        answer = await api.sendGuestQuestion(guestId, clean, image);
        setRemaining((current) => Math.max(0, current - 1));
      }
      setImage(null);
      setPendingMessage(null);
      setMessages((current) => {
        if (current.some((message) => message.id === answer.id)) return current;
        return [...current, answer];
      });
    } catch (error) {
      setText(clean);
      Alert.alert('বার্তা পাঠানো যায়নি', getError(error));
    } finally {
      setPendingMessage(null);
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const feedback = async (item: Question, value: Feedback) => {
    try {
      await api.setFeedback(item.id, value, userId ? { userId } : { guestId });
      setMessages((current) => current.map((message) => message.id === item.id ? { ...message, feedback: value } : message));
    } catch (error) {
      Alert.alert('মতামত পাঠানো যায়নি', getError(error));
    }
  };

  const removeThread = async (id: string) => {
    if (!userId) return;
    try {
      await api.deleteConversation(id, userId);
      if (threadId === id) {
        setThreadId(null);
        setMessages([]);
      }
      setThreads((current) => current.filter((thread) => thread.id !== id));
    } catch (error) {
      Alert.alert('চ্যাট মুছতে সমস্যা', getError(error));
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header
        theme={theme}
        title={title}
        subtitle={userId ? 'আপনার সংরক্ষিত কৃষি আলোচনা' : `অ্যাকাউন্ট ছাড়া প্রশ্ন বাকি ${remaining}/৫`}
        icon="menu-outline"
        onIcon={() => setDrawer(true)}
        right={
          <View style={s.row}>
            <IconButton theme={theme} icon={dark ? 'sunny-outline' : 'moon-outline'} onPress={toggleTheme} />
            <IconButton theme={theme} icon={userId ? 'person-circle-outline' : 'log-in-outline'} onPress={onAccount} />
          </View>
        }
      />
      <FlatList
        ref={listRef}
        style={s.list}
        data={pendingMessage ? [...messages, pendingMessage] : messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={messages.length ? s.messages : s.empty}
        renderItem={({ item }) => <MessageItem theme={theme} item={item} onFeedback={feedback} />}
        ListEmptyComponent={
          <View style={s.welcome}>
            <View style={[s.logo, { backgroundColor: theme.mint }]}><Ionicons name="leaf" size={31} color={theme.primary} /></View>
            <Text style={[s.eyebrow, { color: theme.primary }]}>আপনার ডিজিটাল কৃষি সহকারী</Text>
            <Text style={[s.welcomeTitle, { color: theme.ink }]}>কী জানতে চান?</Text>
            <Text style={[s.welcomeText, { color: theme.muted }]}>
              ফসল, রোগ, সার, সেচ বা পরিচর্যা নিয়ে বাংলায় লিখুন। চাইলে ছবি দিন বা মাইকে বলুন।
            </Text>
            <View style={s.suggestions}>
              {['ধানের পাতা হলুদ হচ্ছে', 'টমেটোর রোগ দেখুন', 'সারের পরামর্শ চাই'].map((label) => (
                <Pressable key={label} onPress={() => setText(label)} style={[s.suggestion, { backgroundColor: theme.card, borderColor: theme.line }]}>
                  <Text style={{ color: theme.ink, fontSize: 12 }}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListFooterComponent={sending ? <TypingIndicator theme={theme} /> : null}
        onContentSizeChange={() => {
          if (sending) listRef.current?.scrollToEnd({ animated: true });
        }}
      />
      <ChatComposer
        theme={theme}
        text={text}
        image={image}
        sending={sending}
        onText={setText}
        onImage={setImage}
        onRemoveImage={() => setImage(null)}
        onSend={() => void send()}
      />
      <HistoryDrawer
        theme={theme}
        visible={drawer}
        threads={threads}
        active={threadId}
        loggedIn={Boolean(userId)}
        onClose={() => setDrawer(false)}
        onNew={() => { setThreadId(null); setMessages([]); setDrawer(false); }}
        onThread={(id) => { setThreadId(id); setDrawer(false); }}
        onDelete={(id) => void removeThread(id)}
        onAccount={onAccount}
      />
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: 6 },
  list: { width: '100%', maxWidth: 820, alignSelf: 'center' },
  messages: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 24 },
  empty: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 26, paddingVertical: 36 },
  welcome: { alignItems: 'center' },
  logo: { width: 72, height: 72, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 12, fontWeight: '800', marginTop: 18 },
  welcomeTitle: { fontSize: 27, fontWeight: '800', marginTop: 5, letterSpacing: -0.4 },
  welcomeText: { textAlign: 'center', lineHeight: 22, marginTop: 9, maxWidth: 340 },
  suggestions: { width: '100%', marginTop: 22, gap: 9 },
  suggestion: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, paddingVertical: 12 },
});
