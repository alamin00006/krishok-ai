import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Theme } from '../theme';
import type { ScreenName } from '../types';

export function BottomTabs({
  theme,
  screen,
  loggedIn,
  onNavigate,
}: {
  theme: Theme;
  screen: ScreenName;
  loggedIn: boolean;
  onNavigate: (screen: ScreenName) => void;
}) {
  const tabs: [ScreenName, string, keyof typeof Ionicons.glyphMap][] = [
    ['chat', 'চ্যাট', 'chatbubble-ellipses-outline'],
    ['crops', 'ফসল', 'leaf-outline'],
    ['diseases', 'রোগ', 'bug-outline'],
    ['experts', 'বিশেষজ্ঞ', 'people-outline'],
    ['account', loggedIn ? 'প্রোফাইল' : 'লগইন', loggedIn ? 'person-circle-outline' : 'log-in-outline'],
  ];
  return (
    <View style={[s.tabs, { backgroundColor: theme.paper, borderColor: theme.line }]}>
      {tabs.map(([target, label, icon]) => {
        const active = screen === target;
        return (
          <Pressable key={target} onPress={() => onNavigate(target)} style={s.tab}>
            <Ionicons name={icon} size={21} color={active ? theme.primary : theme.muted} />
            <Text numberOfLines={1} style={[s.label, { color: active ? theme.primary : theme.muted }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  tabs: { height: 66, borderTopWidth: 1, flexDirection: 'row', paddingBottom: 4 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  label: { fontSize: 10, fontWeight: '800' },
});
