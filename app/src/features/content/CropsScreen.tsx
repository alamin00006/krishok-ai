import { ContentListScreen } from './ContentListScreen';

export function CropsScreen({ onOpen }: { onOpen: (id: string) => void }) {
  return <ContentListScreen section="crops" onOpen={onOpen} />;
}
