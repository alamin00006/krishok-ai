import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { Theme } from '../../theme';

export function TypingIndicator({ theme }: { theme: Theme }) {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={s.row}>
      <View style={[s.avatar, { backgroundColor: theme.mint }]}>
        <Ionicons name="leaf" size={18} color={theme.primary} />
      </View>
      <View style={[s.bubble, { backgroundColor: theme.card, borderColor: theme.line }]}>
        <Text style={[s.label, { color: theme.muted }]}>Krishok.ai উত্তর লিখছে</Text>
        <Animated.View style={[s.dots, { opacity: pulse }]}>
          <View style={[s.dot, { backgroundColor: theme.primary }]} />
          <View style={[s.dot, { backgroundColor: theme.primary }]} />
          <View style={[s.dot, { backgroundColor: theme.primary }]} />
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 18 },
  avatar: { width: 34, height: 34, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  bubble: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 20,
    borderTopLeftRadius: 7,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: { fontSize: 13, fontWeight: '600' },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 5, height: 5, borderRadius: 3 },
});
