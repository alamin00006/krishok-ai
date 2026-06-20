import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field } from '../../components/ui';
import type { Theme } from '../../theme';

export type AuthMode = 'login' | 'register';

export function AuthForm({
  theme,
  mode,
  name,
  phone,
  password,
  loading,
  onMode,
  onName,
  onPhone,
  onPassword,
  onSubmit,
}: {
  theme: Theme;
  mode: AuthMode;
  name: string;
  phone: string;
  password: string;
  loading: boolean;
  onMode: (mode: AuthMode) => void;
  onName: (value: string) => void;
  onPhone: (value: string) => void;
  onPassword: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Card theme={theme}>
      <View style={[s.segment, { backgroundColor: theme.paperDeep }]}>
        {(['login', 'register'] as const).map((item) => (
          <Pressable key={item} onPress={() => onMode(item)} style={[s.segmentButton, mode === item && { backgroundColor: theme.card }]}>
            <Text style={{ color: mode === item ? theme.primary : theme.muted, fontWeight: '900' }}>
              {item === 'login' ? 'লগইন' : 'অ্যাকাউন্ট তৈরি'}
            </Text>
          </Pressable>
        ))}
      </View>
      {mode === 'register' && <Field theme={theme} icon="person-outline" value={name} onChange={onName} placeholder="আপনার নাম" />}
      <Field theme={theme} icon="call-outline" value={phone} onChange={onPhone} placeholder="01712345678" phone />
      <Field theme={theme} icon="key-outline" value={password} onChange={onPassword} placeholder="কমপক্ষে ৬ অক্ষরের password" secure />
      <Button
        theme={theme}
        label={mode === 'register' ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
        icon={mode === 'register' ? 'person-add-outline' : 'log-in-outline'}
        loading={loading}
        onPress={onSubmit}
      />
      <Text style={[s.note, { color: theme.muted }]}>অ্যাকাউন্ট ছাড়া সর্বোচ্চ ৫টি প্রশ্ন করা যাবে।</Text>
    </Card>
  );
}

const s = StyleSheet.create({
  segment: { flexDirection: 'row', borderRadius: 14, padding: 4 },
  segmentButton: { flex: 1, minHeight: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  note: { textAlign: 'center', marginTop: 13, fontSize: 12 },
});
