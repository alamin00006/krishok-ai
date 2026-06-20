import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { api } from '../../api';
import { Header, getError } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import type { ContentResponse, ContentSection } from '../../types';
import { ContentCard } from './ContentCard';

const copy: Record<ContentSection, { title: string; subtitle: string; hero: string; icon: keyof typeof Ionicons.glyphMap }> = {
  crops: { title: 'ফসল গাইড', subtitle: 'চাষ ও পরিচর্যা', hero: 'সঠিক সময়ে সঠিক ফসল', icon: 'leaf-outline' },
  diseases: { title: 'রোগ ও প্রতিকার', subtitle: 'লক্ষণ ও করণীয়', hero: 'দ্রুত রোগ শনাক্ত করুন', icon: 'bug-outline' },
  experts: { title: 'কৃষি বিশেষজ্ঞ', subtitle: 'অভিজ্ঞ পরামর্শক', hero: 'বিশেষজ্ঞের কাছ থেকে জানুন', icon: 'people-outline' },
};

export function ContentListScreen({
  section,
  onOpen,
}: {
  section: ContentSection;
  onOpen: (id: string) => void;
}) {
  const { theme } = useApp();
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
              <Text style={{ color: theme.muted }}>Backend API থেকে পূর্ণ তথ্য দেখুন।</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => <ContentCard theme={theme} item={item} onPress={() => onOpen(item.id)} />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 15, paddingBottom: 30 },
  hero: { borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 15 },
  heroTitle: { fontSize: 18, fontWeight: '900', marginBottom: 3 },
});
