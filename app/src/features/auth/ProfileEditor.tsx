import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field } from '../../components/ui';
import type { Theme } from '../../theme';
import type { User } from '../../types';

export function ProfileEditor({
  theme,
  user,
  saving,
  onSave,
  onLogout,
}: {
  theme: Theme;
  user: User;
  saving: boolean;
  onSave: (name: string) => void;
  onLogout: () => void;
}) {
  const [name, setName] = useState(user.name);
  useEffect(() => setName(user.name), [user.name]);
  return (
    <Card theme={theme}>
      <View style={[s.avatar, { backgroundColor: theme.mint }]}>
        <Text style={[s.avatarText, { color: theme.primary }]}>{user.name.charAt(0) || 'ক'}</Text>
      </View>
      <Text style={[s.name, { color: theme.ink }]}>{user.name}</Text>
      <Text style={[s.center, { color: theme.muted }]}>{user.phone}</Text>
      <Text style={[s.count, { color: theme.muted }]}>
        {user._count?.conversations ?? 0}টি সংরক্ষিত চ্যাট
      </Text>
      <View style={[s.divider, { backgroundColor: theme.line }]} />
      <Text style={[s.label, { color: theme.ink }]}>প্রোফাইলের নাম</Text>
      <Field theme={theme} icon="create-outline" value={name} onChange={setName} placeholder="নাম পরিবর্তন করুন" />
      <Button theme={theme} label="নাম সংরক্ষণ করুন" icon="save-outline" loading={saving} onPress={() => onSave(name)} />
      <Button theme={theme} label="লগআউট করুন" icon="log-out-outline" danger onPress={onLogout} />
    </Card>
  );
}

const s = StyleSheet.create({
  avatar: { width: 76, height: 76, borderRadius: 28, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 31, fontWeight: '900' },
  name: { textAlign: 'center', fontSize: 22, fontWeight: '900', marginTop: 10 },
  center: { textAlign: 'center', marginTop: 3 },
  count: { textAlign: 'center', marginTop: 8, fontSize: 12 },
  divider: { height: 1, marginVertical: 20 },
  label: { fontSize: 13, fontWeight: '700' },
});
