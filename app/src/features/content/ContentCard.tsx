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
          <Text style={{ color: theme.primary, fontWeight: '800' }}>বিস্তারিত দেখুন</Text>
          <Ionicons name="arrow-forward" size={17} color={theme.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 24, overflow: 'hidden', marginBottom: 17, elevation: 2 },
  image: { width: '100%', height: 184 },
  body: { padding: 17 },
  category: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  name: { fontSize: 21, fontWeight: '800', marginTop: 4, letterSpacing: -0.2 },
  summary: { lineHeight: 22, marginTop: 8, fontSize: 13 },
  more: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
});
