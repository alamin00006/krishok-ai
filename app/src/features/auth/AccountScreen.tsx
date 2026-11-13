import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { api, API_URL } from '../../api';
import { Header, getError } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import type { User } from '../../types';
import { AuthForm, type AuthMode } from './AuthForm';
import { ProfileEditor } from './ProfileEditor';

export function AccountScreen({ onDone }: { onDone: () => void }) {
  const { theme, userId, login, logout } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null);

  useEffect(() => {
    if (userId) void api.user(userId).then(setUser).catch((error) => setMessage({ error: true, text: getError(error) }));
    else setUser(null);
  }, [userId]);

  const submit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = mode === 'register'
        ? await api.register({ name, phone, password })
        : await api.login({ phone, password });
      await login(result);
      setUser(result);
      setPassword('');
      setMessage({ error: false, text: mode === 'register' ? 'অ্যাকাউন্ট তৈরি হয়েছে।' : 'লগইন সফল হয়েছে।' });
      onDone();
    } catch (error) {
      setMessage({ error: true, text: getError(error) });
    } finally {
      setLoading(false);
    }
  };

  const saveName = async (nextName: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      const updated = await api.updateUser(userId, nextName);
      setUser(updated);
      setMessage({ error: false, text: 'নাম আপডেট হয়েছে।' });
    } catch (error) {
      setMessage({ error: true, text: getError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.flex}>
      <Header
        theme={theme}
        title={userId ? 'আমার প্রোফাইল' : 'অ্যাকাউন্ট'}
        subtitle={userId ? 'আপনার তথ্য ও সংরক্ষিত চ্যাট' : 'লগইন অথবা অ্যাকাউন্ট তৈরি করুন'}
        icon="person-outline"
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
        <View style={s.inner}>
        {!!message && (
          <View style={[s.message, { backgroundColor: message.error ? theme.redSoft : theme.mint, borderColor: message.error ? theme.red : theme.primary }]}>
            <Text style={{ color: message.error ? theme.red : theme.primary }}>{message.text}</Text>
          </View>
        )}
        {userId && user ? (
          <ProfileEditor
            theme={theme}
            user={user}
            saving={loading}
            onSave={(value) => void saveName(value)}
            onLogout={() => void logout().then(onDone)}
          />
        ) : (
          <AuthForm
            theme={theme}
            mode={mode}
            name={name}
            phone={phone}
            password={password}
            loading={loading}
            onMode={setMode}
            onName={setName}
            onPhone={setPhone}
            onPassword={setPassword}
            onSubmit={() => void submit()}
          />
        )}
        <Text style={[s.api, { color: theme.muted }]}>সংযুক্ত সার্ভার: {API_URL}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 34 },
  inner: { width: '100%', maxWidth: 620, alignSelf: 'center' },
  message: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 12 },
  api: { textAlign: 'center', fontSize: 10, marginTop: 4 },
});
