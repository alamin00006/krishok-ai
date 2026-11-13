import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';

import { BottomTabs } from './src/components/BottomTabs';
import { Loading } from './src/components/ui';
import { AppProvider, useApp } from './src/context/AppContext';
import { AccountScreen } from './src/features/auth/AccountScreen';
import { ChatScreen } from './src/features/chat/ChatScreen';
import { CropsScreen } from './src/features/content/CropsScreen';
import { DetailScreen } from './src/features/content/DetailScreen';
import { DiseasesScreen } from './src/features/content/DiseasesScreen';
import type { DetailTarget, ScreenName } from './src/types';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <KrishokApp />
      </AppProvider>
    </SafeAreaProvider>
  );
}

function KrishokApp() {
  const { ready, dark, theme, userId } = useApp();
  const [screen, setScreen] = useState<ScreenName>('chat');
  const [detail, setDetail] = useState<DetailTarget>(null);

  const navigate = (next: ScreenName) => {
    setDetail(null);
    setScreen(next);
  };
  const openDetail = (section: 'crops' | 'diseases', id: string) => {
    setDetail({ section, id });
    setScreen('detail');
  };

  if (!ready) return <Loading theme={theme} />;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[s.safe, { backgroundColor: theme.background }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <View style={s.flex}>
        {screen === 'chat' && <ChatScreen onAccount={() => navigate('account')} />}
        {screen === 'crops' && <CropsScreen onOpen={(id) => openDetail('crops', id)} />}
        {screen === 'diseases' && <DiseasesScreen onOpen={(id) => openDetail('diseases', id)} />}
        {screen === 'account' && <AccountScreen onDone={() => navigate('chat')} />}
        {screen === 'detail' && detail && <DetailScreen target={detail} onBack={() => navigate(detail.section)} />}
      </View>
      {screen !== 'detail' && (
        <BottomTabs theme={theme} screen={screen} loggedIn={Boolean(userId)} onNavigate={navigate} />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
