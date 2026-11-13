import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { Theme } from '../../theme';
import type { Feedback, Question } from '../../types';
import { AnswerFeedback } from './AnswerFeedback';

export function MessageItem({
  theme,
  item,
  onFeedback,
}: {
  theme: Theme;
  item: Question;
  onFeedback: (item: Question, feedback: Feedback) => void;
}) {
  return (
    <View style={s.wrap}>
      <View style={s.userRow}>
        <View style={[s.userBubble, { backgroundColor: theme.mint, borderColor: theme.line }]}>
          <Text style={[s.message, { color: theme.ink }]}>{item.text}</Text>
          {!!item.imageUrl && <Image source={{ uri: item.imageUrl }} style={s.image} resizeMode="cover" />}
        </View>
      </View>
      {!!item.aiAnswer && (
        <View style={s.aiRow}>
          <View style={[s.avatar, { backgroundColor: theme.mint }]}>
            <Ionicons name="leaf" size={18} color={theme.primary} />
          </View>
          <View style={[s.aiBubble, { backgroundColor: theme.card, borderColor: theme.line }]}>
            <Text style={[s.message, { color: theme.ink }]}>{item.aiAnswer}</Text>
            <AnswerFeedback theme={theme} value={item.feedback} onChange={(value) => onFeedback(item, value)} />
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 20 },
  userRow: { alignItems: 'flex-end' },
  userBubble: { maxWidth: '84%', borderWidth: 1, borderRadius: 21, borderBottomRightRadius: 7, paddingHorizontal: 15, paddingVertical: 13 },
  aiRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 10 },
  avatar: { width: 34, height: 34, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  aiBubble: { flex: 1, borderWidth: 1, borderRadius: 21, borderTopLeftRadius: 7, padding: 15, elevation: 1 },
  message: { fontSize: 15, lineHeight: 24 },
  image: { width: '100%', maxWidth: 260, aspectRatio: 3 / 2, borderRadius: 13, marginTop: 9 },
});
