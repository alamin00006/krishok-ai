import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Theme } from '../../theme';
import type { Feedback } from '../../types';

export function AnswerFeedback({
  theme,
  value,
  onChange,
}: {
  theme: Theme;
  value?: Feedback | null;
  onChange: (value: Feedback) => void;
}) {
  return (
    <View style={s.row}>
      <Text style={[s.label, { color: theme.muted }]}>উত্তরটি সহায়ক?</Text>
      {(['LIKE', 'DISLIKE'] as const).map((feedback) => {
        const selected = value === feedback;
        return (
          <Pressable
            key={feedback}
            onPress={() => onChange(feedback)}
            style={[s.button, { backgroundColor: selected ? theme.mint : 'transparent' }]}>
            <Ionicons
              name={feedback === 'LIKE' ? 'thumbs-up-outline' : 'thumbs-down-outline'}
              size={17}
              color={selected ? theme.primary : theme.muted}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  label: { fontSize: 11, marginRight: 2 },
  button: { width: 32, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
