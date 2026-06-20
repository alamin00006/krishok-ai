import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
      Alert.alert('সমস্যা', getError(error));
    }
  }, [guestId, threadId, userId]);

  useEffect(() => void load(), [load]);

  const send = async () => {
    const clean = text.trim();
    if (!clean || sending) return;
    setText('');
    setSending(true);
    try {
      if (userId) {
        let active = threadId;
        if (!active) {
          const conversation = await api.createConversation(userId, clean);
          active = conversation.id;
          setThreadId(active);
        }
        await api.sendMessage(active, userId, clean, image);
      } else {
        await api.sendGuestQuestion(guestId, clean, image);
      }
      setImage(null);
      await load();
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    } catch (error) {
      setText(clean);
      Alert.alert('বার্তা পাঠানো যায়নি', getError(error));
    } finally {
      setSending(false);
    }
  };

  const feedback = async (item: Question, value: Feedback) => {
    try {
      await api.setFeedback(item.id, value, userId ? { userId } : { guestId });
      setMessages((current) => current.map((message) => message.id === item.id ? { ...message, feedback: value } : message));
    } catch (error) {
      Alert.alert('Feedback পাঠানো যায়নি', getError(error));
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
        subtitle={userId ? 'সংরক্ষিত কৃষি আলোচনা' : `Guest প্রশ্ন বাকি ${remaining}/৫`}
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
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={messages.length ? s.messages : s.empty}
        renderItem={({ item }) => <MessageItem theme={theme} item={item} onFeedback={feedback} />}
        ListEmptyComponent={
          <View style={s.welcome}>
            <View style={[s.logo, { backgroundColor: theme.mint }]}><Ionicons name="leaf" size={31} color={theme.primary} /></View>
            <Text style={[s.welcomeTitle, { color: theme.ink }]}>কৃষি বিষয়ে প্রশ্ন করুন</Text>
            <Text style={[s.welcomeText, { color: theme.muted }]}>ফসল, রোগ, সার বা পরিচর্যা—বাংলায় লিখুন অথবা মাইকে বলুন।</Text>
          </View>
        }
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
  messages: { padding: 14, paddingBottom: 22 },
  empty: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  welcome: { alignItems: 'center' },
  logo: { width: 66, height: 66, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  welcomeTitle: { fontSize: 22, fontWeight: '900', marginTop: 15 },
  welcomeText: { textAlign: 'center', lineHeight: 22, marginTop: 7 },
});
