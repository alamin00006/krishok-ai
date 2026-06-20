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
          {!!item.imageUrl && <Image source={{ uri: item.imageUrl }} style={s.image} />}
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
  wrap: { marginBottom: 16 },
  userRow: { alignItems: 'flex-end' },
  userBubble: { maxWidth: '84%', borderWidth: 1, borderRadius: 20, borderBottomRightRadius: 6, padding: 13 },
  aiRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 10 },
  avatar: { width: 34, height: 34, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  aiBubble: { flex: 1, borderWidth: 1, borderRadius: 20, borderTopLeftRadius: 6, padding: 14 },
  message: { fontSize: 15, lineHeight: 24 },
  image: { width: 190, height: 130, borderRadius: 13, marginTop: 9 },
});
