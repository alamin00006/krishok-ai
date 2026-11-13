import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { api } from '../../api';
import { Header, getError } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import type { ContentResponse, ContentSection } from '../../types';
import { ContentCard } from './ContentCard';

const copy: Record<ContentSection, { title: string; subtitle: string; hero: string; icon: keyof typeof Ionicons.glyphMap }> = {
  crops: { title: 'ফসল গাইড', subtitle: 'চাষ, পরিচর্যা ও ফলনের তথ্য', hero: 'ফসলের যত্ন হোক সহজ', icon: 'leaf-outline' },
  diseases: { title: 'রোগ ও প্রতিকার', subtitle: 'লক্ষণ চিনুন, করণীয় জানুন', hero: 'শুরুতেই রোগ শনাক্ত করুন', icon: 'bug-outline' },
};

export function ContentListScreen({
  section,
  onOpen,
}: {
  section: ContentSection;
  onOpen: (id: string) => void;
}) {
  const { theme } = useApp();
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 2 : 1;
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setContent(await api.content());
    } catch (error) {
      Alert.alert('তথ্য আনা যায়নি', getError(error));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => void load(), [load]);
  const meta = copy[section];

  return (
    <View style={s.flex}>
      <Header theme={theme} title={meta.title} subtitle={meta.subtitle} icon={meta.icon} />
      <FlatList
        key={columns}
        numColumns={columns}
        data={content?.[section] ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.content}
        refreshing={loading}
        onRefresh={load}
        ListHeaderComponent={
          <View style={[s.hero, { backgroundColor: theme.mint, borderColor: theme.line }]}>
            <Ionicons name={meta.icon} size={30} color={theme.primary} />
            <View style={s.flex}>
              <Text style={[s.heroTitle, { color: theme.ink }]}>{meta.hero}</Text>
              <Text style={[s.heroText, { color: theme.muted }]}>
                প্রয়োজনীয় তথ্য, পরামর্শ ও করণীয় এক জায়গায় দেখুন।
              </Text>
            </View>
          </View>
        }
        columnWrapperStyle={columns > 1 ? s.columns : undefined}
        renderItem={({ item }) => (
          <View style={columns > 1 ? s.columnItem : undefined}>
            <ContentCard theme={theme} item={item} onPress={() => onOpen(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 34 },
  columns: { gap: 16 },
  columnItem: { flex: 1, minWidth: 0 },
  hero: { borderWidth: 1, borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  heroTitle: { fontSize: 19, fontWeight: '800', marginBottom: 4 },
  heroText: { fontSize: 12, lineHeight: 18 },
});
