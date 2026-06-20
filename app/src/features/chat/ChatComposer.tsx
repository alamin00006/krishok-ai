import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Theme } from '../../theme';
import type { PickedImage } from '../../types';
import { ImageInputButton } from '../media/ImageInputButton';
import { VoiceInputButton } from '../media/VoiceInputButton';

export function ChatComposer({
  theme,
  text,
  image,
  sending,
  onText,
  onImage,
  onRemoveImage,
  onSend,
}: {
  theme: Theme;
  text: string;
  image: PickedImage | null;
  sending: boolean;
  onText: (value: string) => void;
  onImage: (value: PickedImage) => void;
  onRemoveImage: () => void;
  onSend: () => void;
}) {
  return (
    <View style={[s.area, { backgroundColor: theme.paper }]}>
      {!!image && (
        <View style={[s.chip, { borderColor: theme.line }]}>
          <Image source={{ uri: image.uri }} style={s.thumb} />
          <Text numberOfLines={1} style={[s.flex, { color: theme.ink }]}>{image.name}</Text>
          <Pressable onPress={onRemoveImage}><Ionicons name="close-circle" size={21} color={theme.red} /></Pressable>
        </View>
      )}
      <View style={[s.composer, { backgroundColor: theme.card, borderColor: theme.line }]}>
        <TextInput
          value={text}
          onChangeText={onText}
          multiline
          placeholder="আপনার কৃষি সমস্যা লিখুন..."
          placeholderTextColor={theme.muted}
          style={[s.input, { color: theme.ink }]}
        />
        <VoiceInputButton theme={theme} onTranscript={onText} />
        <ImageInputButton theme={theme} onPick={onImage} />
        <Pressable disabled={!text.trim() || sending} onPress={onSend} style={[s.send, { backgroundColor: text.trim() ? theme.primary : theme.line }]}>
          {sending ? <ActivityIndicator color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  area: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 },
  composer: { borderWidth: 1, borderRadius: 22, flexDirection: 'row', alignItems: 'flex-end', gap: 5, padding: 7 },
  input: { flex: 1, minHeight: 42, maxHeight: 110, paddingHorizontal: 9, paddingVertical: 10, fontSize: 15 },
  send: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  chip: { borderWidth: 1, borderRadius: 14, padding: 6, marginBottom: 7, flexDirection: 'row', alignItems: 'center', gap: 8 },
  thumb: { width: 38, height: 38, borderRadius: 9 },
});
