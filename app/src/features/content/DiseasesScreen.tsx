import { ContentListScreen } from './ContentListScreen';

export function DiseasesScreen({ onOpen }: { onOpen: (id: string) => void }) {
  return <ContentListScreen section="diseases" onOpen={onOpen} />;
}
