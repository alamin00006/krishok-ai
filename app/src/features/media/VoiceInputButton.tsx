import { requireOptionalNativeModule } from 'expo';
import { Alert } from 'react-native';
import { IconButton } from '../../components/ui';
import type { Theme } from '../../theme';

export function VoiceInputButton({
  theme,
  onTranscript,
}: {
  theme: Theme;
  onTranscript: (text: string) => void;
}) {
  const start = async () => {
    const nativeModule = requireOptionalNativeModule('ExpoSpeechRecognition');
    if (!nativeModule) {
      Alert.alert(
        'Development build প্রয়োজন',
        'Voice input Expo Go-তে চলে না। টার্মিনালে npm run android চালিয়ে development build ব্যবহার করুন।'
      );
      return;
    }

    try {
      const { ExpoSpeechRecognitionModule } = await import('expo-speech-recognition');
      const subscriptions = [
        ExpoSpeechRecognitionModule.addListener('result', (event) => {
          const transcript = event.results[0]?.transcript?.trim();
          if (transcript) onTranscript(transcript);
        }),
        ExpoSpeechRecognitionModule.addListener('error', (event) => {
          Alert.alert('ভয়েস ইনপুট', event.message || 'কথা শনাক্ত করা যায়নি।');
          subscriptions.forEach((subscription) => subscription.remove());
        }),
        ExpoSpeechRecognitionModule.addListener('end', () => {
          subscriptions.forEach((subscription) => subscription.remove());
        }),
      ];

      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        subscriptions.forEach((subscription) => subscription.remove());
        Alert.alert('অনুমতি প্রয়োজন', 'ভয়েস ইনপুটের জন্য মাইক্রোফোন ব্যবহারের অনুমতি দিন।');
        return;
      }

      ExpoSpeechRecognitionModule.start({
        lang: 'bn-BD',
        interimResults: true,
        continuous: false,
      });
    } catch {
      Alert.alert('ভয়েস ইনপুট চালু হয়নি', 'Development build পুনরায় তৈরি করে চেষ্টা করুন।');
    }
  };

  return <IconButton theme={theme} icon="mic-outline" onPress={() => void start()} />;
}
