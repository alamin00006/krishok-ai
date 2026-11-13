import { Ionicons } from '@expo/vector-icons';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton } from '../../components/ui';
import type { Theme } from '../../theme';
import type { ConversationSummary } from '../../types';

export function HistoryDrawer({
  theme,
  visible,
  threads,
  active,
  loggedIn,
  onClose,
  onNew,
  onThread,
  onDelete,
  onAccount,
}: {
  theme: Theme;
  visible: boolean;
  threads: ConversationSummary[];
  active: string | null;
  loggedIn: boolean;
  onClose: () => void;
  onNew: () => void;
  onThread: (id: string) => void;
  onDelete: (id: string) => void;
  onAccount: () => void;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modal}>
        <Pressable onPress={onClose} style={s.backdrop} />
        <View
          style={[
            s.drawer,
            {
              width: Math.min(width * 0.88, 380),
              paddingTop: Math.max(18, insets.top + 10),
              paddingBottom: Math.max(12, insets.bottom),
              backgroundColor: theme.paper,
              borderColor: theme.line,
            },
          ]}>
          <View style={s.head}>
            <View style={s.flex}>
              <Text style={[s.brand, { color: theme.ink }]}>Krishok.ai</Text>
              <Text style={{ color: theme.muted }}>কৃষকের ডিজিটাল সহকারী</Text>
            </View>
            <IconButton theme={theme} icon="close" onPress={onClose} />
          </View>
          <Button theme={theme} label="নতুন চ্যাট" icon="add" onPress={onNew} />
          <Text style={[s.label, { color: theme.muted }]}>সাম্প্রতিক চ্যাট</Text>
          <ScrollView style={s.flex}>
            {threads.map((thread) => (
              <View key={thread.id} style={[s.thread, active === thread.id && { backgroundColor: theme.mint }]}>
                <Pressable onPress={() => onThread(thread.id)} style={s.threadMain}>
                  <Ionicons name="chatbox-outline" size={18} color={theme.primary} />
                  <Text numberOfLines={1} style={[s.flex, { color: theme.ink }]}>{thread.title}</Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    Alert.alert('চ্যাট মুছবেন?', 'এই চ্যাটের সব বার্তা মুছে যাবে।', [
                      { text: 'বাতিল', style: 'cancel' },
                      { text: 'মুছুন', style: 'destructive', onPress: () => onDelete(thread.id) },
                    ])
                  }>
                  <Ionicons name="trash-outline" size={18} color={theme.red} />
                </Pressable>
              </View>
            ))}
            {!loggedIn && <Text style={[s.note, { color: theme.muted }]}>চ্যাট ইতিহাস রাখতে লগইন করুন।</Text>}
          </ScrollView>
          <Pressable onPress={onAccount} style={[s.account, { borderColor: theme.line }]}>
            <Ionicons name={loggedIn ? 'person-circle-outline' : 'log-in-outline'} size={22} color={theme.primary} />
            <Text style={{ color: theme.ink, fontWeight: '800' }}>{loggedIn ? 'প্রোফাইল' : 'লগইন'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  modal: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.45)' },
  drawer: { height: '100%', borderRightWidth: 1, paddingHorizontal: 16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brand: { fontSize: 24, fontWeight: '800' },
  label: { marginTop: 24, marginBottom: 8, fontSize: 12, fontWeight: '800' },
  thread: { borderRadius: 14, padding: 10, marginBottom: 5, flexDirection: 'row', alignItems: 'center' },
  threadMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  note: { textAlign: 'center', marginTop: 24 },
  account: { borderTopWidth: 1, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', gap: 9 },
});
