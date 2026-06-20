import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Theme } from '../../theme';
import type { ContentItem } from '../../types';

export function ContentCard({ theme, item, onPress }: { theme: Theme; item: ContentItem; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.card, { backgroundColor: theme.card, borderColor: theme.line }]}>
      <Image source={{ uri: item.image }} style={s.image} />
      <View style={s.body}>
        <Text style={[s.category, { color: theme.primary }]}>{item.category}</Text>
        <Text style={[s.name, { color: theme.ink }]}>{item.name}</Text>
        <Text numberOfLines={2} style={[s.summary, { color: theme.muted }]}>{item.summary}</Text>
        <View style={s.more}>
          <Text style={{ color: theme.primary, fontWeight: '900' }}>বিস্তারিত</Text>
          <Ionicons name="arrow-forward" size={17} color={theme.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 22, overflow: 'hidden', marginBottom: 15 },
  image: { width: '100%', height: 175 },
  body: { padding: 15 },
  category: { fontSize: 12, fontWeight: '900' },
  name: { fontSize: 20, fontWeight: '900', marginTop: 3 },
  summary: { lineHeight: 21, marginTop: 7 },
  more: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 11 },
});
