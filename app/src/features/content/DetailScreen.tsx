import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../../api';
import { Card, Header, Loading, getError } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import type { ContentItem, DetailTarget } from '../../types';

export function DetailScreen({
  target,
  onBack,
}: {
  target: NonNullable<DetailTarget>;
  onBack: () => void;
}) {
  const { theme } = useApp();
  const [item, setItem] = useState<ContentItem | null>(null);
  useEffect(() => {
    setItem(null);
    void api.contentDetail(target.section, target.id).then(setItem).catch((error) => Alert.alert('তথ্য আনা যায়নি', getError(error)));
  }, [target]);
  return (
    <View style={s.flex}>
      <Header theme={theme} title="বিস্তারিত তথ্য" icon="arrow-back" onIcon={onBack} />
      {!item ? <Loading theme={theme} /> : (
        <ScrollView contentContainerStyle={s.content}>
          <View style={s.inner}>
          <Image source={{ uri: item.image }} style={s.image} />
          <Card theme={theme}>
            <Text style={[s.category, { color: theme.primary }]}>{item.category}</Text>
            <Text style={[s.title, { color: theme.ink }]}>{item.name}</Text>
            <Text style={[s.body, { color: theme.muted }]}>{item.summary}</Text>
          </Card>
          {item.stats.map((stat) => (
            <Card key={stat.label} theme={theme}>
              <Text style={[s.label, { color: theme.muted }]}>{stat.label}</Text>
              <Text style={[s.value, { color: theme.ink }]}>{stat.value}</Text>
            </Card>
          ))}
          {item.sections.map((section) => (
            <Card key={section.title} theme={theme}>
              <Text style={[s.section, { color: theme.ink }]}>{section.title}</Text>
              {section.items.map((line) => (
                <View key={line} style={s.bullet}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
                  <Text style={[s.body, s.flex, { color: theme.muted }]}>{line}</Text>
                </View>
              ))}
            </Card>
          ))}
          <View style={[s.alert, { backgroundColor: theme.amberSoft, borderColor: theme.amber }]}>
            <Ionicons name="warning-outline" size={22} color={theme.amber} />
            <Text style={[s.body, s.flex, { color: theme.amber }]}>{item.alert}</Text>
          </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 15, paddingBottom: 35 },
  inner: { width: '100%', maxWidth: 820, alignSelf: 'center' },
  image: { width: '100%', aspectRatio: 16 / 10, maxHeight: 380, borderRadius: 23, marginBottom: 14 },
  category: { fontWeight: '900' },
  title: { fontSize: 25, fontWeight: '900', marginTop: 4 },
  body: { lineHeight: 23, marginTop: 7 },
  label: { fontSize: 12 },
  value: { fontSize: 18, fontWeight: '900', marginTop: 3 },
  section: { fontSize: 18, fontWeight: '900', marginBottom: 7 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 5 },
  alert: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', gap: 9 },
});
