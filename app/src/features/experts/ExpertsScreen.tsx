import { ContentListScreen } from '../content/ContentListScreen';

export function ExpertsScreen({ onOpen }: { onOpen: (id: string) => void }) {
  return <ContentListScreen section="experts" onOpen={onOpen} />;
}
