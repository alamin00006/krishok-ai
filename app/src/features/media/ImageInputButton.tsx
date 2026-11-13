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
    name:
      asset.fileName ??
      `crop-${Date.now()}.${asset.mimeType === 'image/png' ? 'png' : 'jpg'}`,
    type: asset.mimeType?.startsWith('image/') ? asset.mimeType : 'image/jpeg',
  });

  const library = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled) onPick(mapAsset(result.assets[0]));
  };
  const camera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('অনুমতি প্রয়োজন', 'ছবি তোলার জন্য ক্যামেরা ব্যবহারের অনুমতি দিন।');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled) onPick(mapAsset(result.assets[0]));
  };

  return (
    <IconButton
      theme={theme}
      icon="camera-outline"
      onPress={() =>
        Alert.alert('ফসলের ছবি', 'কোথা থেকে ছবি নেবেন?', [
          { text: 'ক্যামেরা খুলুন', onPress: () => void camera() },
          { text: 'গ্যালারি থেকে নিন', onPress: () => void library() },
          { text: 'বাতিল', style: 'cancel' },
        ])
      }
    />
  );
}
