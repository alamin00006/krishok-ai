import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const compact = width < 350;
  const tabs: [ScreenName, string, keyof typeof Ionicons.glyphMap][] = [
    ['chat', 'চ্যাট', 'chatbubble-ellipses-outline'],
    ['crops', 'ফসল', 'leaf-outline'],
    ['diseases', 'রোগ', 'bug-outline'],
    ['account', loggedIn ? 'প্রোফাইল' : 'লগইন', loggedIn ? 'person-circle-outline' : 'log-in-outline'],
  ];
  return (
    <View style={[s.tabs, { height: 66 + insets.bottom, paddingBottom: Math.max(5, insets.bottom), backgroundColor: theme.paper, borderColor: theme.line }]}>
      {tabs.map(([target, label, icon]) => {
        const active = screen === target;
        return (
          <Pressable key={target} onPress={() => onNavigate(target)} style={s.tab}>
            <View style={[s.iconWrap, active && { backgroundColor: theme.mint }]}>
              <Ionicons name={icon} size={21} color={active ? theme.primary : theme.muted} />
            </View>
            {!compact && <Text numberOfLines={1} style={[s.label, { color: active ? theme.primary : theme.muted }]}>{label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  tabs: { height: 72, borderTopWidth: 1, flexDirection: 'row', paddingBottom: 5, paddingTop: 4 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconWrap: { width: 38, height: 30, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, fontWeight: '700' },
});
