import { Alert } from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { IconButton } from '../../components/ui';
import type { Theme } from '../../theme';

export function VoiceInputButton({
  theme,
  onTranscript,
}: {
  theme: Theme;
  onTranscript: (text: string) => void;
}) {
  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript?.trim();
    if (transcript) onTranscript(transcript);
  });
  useSpeechRecognitionEvent('error', (event) => {
    Alert.alert('ভয়েস ইনপুট', event.message || 'কথা শনাক্ত করা যায়নি।');
  });

  const start = async () => {
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('অনুমতি প্রয়োজন', 'ভয়েস ইনপুটের জন্য মাইক্রোফোন অনুমতি দিন।');
      return;
    }
    ExpoSpeechRecognitionModule.start({
      lang: 'bn-BD',
      interimResults: true,
      continuous: false,
    });
  };

  return <IconButton theme={theme} icon="mic-outline" onPress={() => void start()} />;
}
