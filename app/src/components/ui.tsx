import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Theme } from '../theme';

export function Header({
  theme,
  title,
  subtitle,
  icon,
  onIcon,
  right,
}: {
  theme: Theme;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onIcon?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={[s.header, { backgroundColor: theme.paper, borderColor: theme.line }]}>
      <Pressable disabled={!onIcon} onPress={onIcon} style={[s.icon, { backgroundColor: theme.mint }]}>
        <Ionicons name={icon} size={22} color={theme.primary} />
      </Pressable>
      <View style={s.flex}>
        <Text numberOfLines={1} style={[s.title, { color: theme.ink }]}>{title}</Text>
        {!!subtitle && <Text numberOfLines={1} style={[s.subtitle, { color: theme.muted }]}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

export function IconButton({
  theme,
  icon,
  onPress,
  disabled,
}: {
  theme: Theme;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={[s.icon, { backgroundColor: theme.mint, opacity: disabled ? 0.5 : 1 }]}>
      <Ionicons name={icon} size={21} color={theme.primary} />
    </Pressable>
  );
}

export function Button({
  theme,
  label,
  icon,
  onPress,
  loading,
  danger,
}: {
  theme: Theme;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  loading?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={[s.button, { backgroundColor: danger ? theme.red : theme.primary }]}>
      {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name={icon} size={19} color="#fff" />}
      <Text style={s.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  theme,
  icon,
  value,
  onChange,
  placeholder,
  secure,
  phone,
}: {
  theme: Theme;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  secure?: boolean;
  phone?: boolean;
}) {
  return (
    <View style={[s.field, { backgroundColor: theme.paper, borderColor: theme.line }]}>
      <Ionicons name={icon} size={19} color={theme.primary} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        secureTextEntry={secure}
        keyboardType={phone ? 'phone-pad' : 'default'}
        style={[s.input, { color: theme.ink }]}
      />
    </View>
  );
}

export function Card({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.line }]}>{children}</View>;
}

export function Loading({ theme }: { theme: Theme }) {
  return <View style={s.loading}><ActivityIndicator size="large" color={theme.primary} /></View>;
}

export function getError(error: unknown) {
  return error instanceof Error ? error.message : 'কাজটি সম্পন্ন করা যায়নি।';
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  header: { minHeight: 68, borderBottomWidth: 1, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 11 },
  icon: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '900' },
  subtitle: { fontSize: 12, marginTop: 2 },
  button: { minHeight: 48, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  field: { minHeight: 50, borderWidth: 1, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9, marginTop: 11 },
  input: { flex: 1, fontSize: 15 },
  card: { borderWidth: 1, borderRadius: 22, padding: 17, marginBottom: 13 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
