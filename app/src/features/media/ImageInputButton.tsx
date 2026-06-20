import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { IconButton } from '../../components/ui';
import type { Theme } from '../../theme';
import type { PickedImage } from '../../types';

export function ImageInputButton({
  theme,
  onPick,
}: {
  theme: Theme;
  onPick: (image: PickedImage) => void;
}) {
  const mapAsset = (asset: ImagePicker.ImagePickerAsset): PickedImage => ({
    uri: asset.uri,
    name: asset.fileName ?? `crop-${Date.now()}.jpg`,
    type: asset.mimeType ?? 'image/jpeg',
  });

  const library = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.75 });
    if (!result.canceled) onPick(mapAsset(result.assets[0]));
  };
  const camera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('অনুমতি প্রয়োজন', 'ছবি তোলার জন্য ক্যামেরা অনুমতি দিন।');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.75 });
    if (!result.canceled) onPick(mapAsset(result.assets[0]));
  };

  return (
    <IconButton
      theme={theme}
      icon="camera-outline"
      onPress={() =>
        Alert.alert('ফসলের ছবি', 'ছবির উৎস নির্বাচন করুন', [
          { text: 'ক্যামেরা', onPress: () => void camera() },
          { text: 'গ্যালারি', onPress: () => void library() },
          { text: 'বাতিল', style: 'cancel' },
        ])
      }
    />
  );
}
