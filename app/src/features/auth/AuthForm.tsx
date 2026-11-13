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
      <View style={s.intro}>
        <View style={[s.brandIcon, { backgroundColor: theme.mint }]}>
          <Text style={[s.brandLeaf, { color: theme.primary }]}>🌱</Text>
        </View>
        <Text style={[s.title, { color: theme.ink }]}>
          {mode === 'login' ? 'স্বাগতম' : 'নতুন অ্যাকাউন্ট খুলুন'}
        </Text>
        <Text style={[s.subtitle, { color: theme.muted }]}>
          {mode === 'login'
            ? 'আপনার সংরক্ষিত কৃষি আলোচনায় ফিরে যান।'
            : 'চ্যাট ইতিহাস রাখতে এক মিনিটেই অ্যাকাউন্ট তৈরি করুন।'}
        </Text>
      </View>
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
      <Field theme={theme} icon="key-outline" value={password} onChange={onPassword} placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড" secure />
      <Button
        theme={theme}
        label={mode === 'register' ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
        icon={mode === 'register' ? 'person-add-outline' : 'log-in-outline'}
        loading={loading}
        onPress={onSubmit}
      />
      <Text style={[s.note, { color: theme.muted }]}>
        অ্যাকাউন্ট ছাড়াও সর্বোচ্চ ৫টি প্রশ্ন করতে পারবেন।
      </Text>
    </Card>
  );
}

const s = StyleSheet.create({
  intro: { alignItems: 'center', marginBottom: 22 },
  brandIcon: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  brandLeaf: { fontSize: 27 },
  title: { fontSize: 24, fontWeight: '800', marginTop: 13 },
  subtitle: { fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 5 },
  segment: { flexDirection: 'row', borderRadius: 14, padding: 4 },
  segmentButton: { flex: 1, minHeight: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  note: { textAlign: 'center', marginTop: 16, fontSize: 12, lineHeight: 18 },
});
