import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { makeTheme, type Theme } from '../theme';
import type { User } from '../types';

const USER_KEY = 'krishok-user-id';
const GUEST_KEY = 'krishok-guest-id';

type AppState = {
  ready: boolean;
  dark: boolean;
  theme: Theme;
  userId: string | null;
  guestId: string;
  toggleTheme: () => void;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(scheme === 'dark');
  const [userId, setUserId] = useState<string | null>(null);
  const [guestId, setGuestId] = useState('');

  useEffect(() => {
    void (async () => {
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      let storedGuest = await AsyncStorage.getItem(GUEST_KEY);
      if (!storedGuest) {
        storedGuest = `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        await AsyncStorage.setItem(GUEST_KEY, storedGuest);
      }
      setUserId(storedUser);
      setGuestId(storedGuest);
      setReady(true);
    })();
  }, []);

  const value = useMemo<AppState>(
    () => ({
      ready,
      dark,
      theme: makeTheme(dark),
      userId,
      guestId,
      toggleTheme: () => setDark((current) => !current),
      login: async (user) => {
        await AsyncStorage.setItem(USER_KEY, user.id);
        setUserId(user.id);
      },
      logout: async () => {
        await AsyncStorage.removeItem(USER_KEY);
        setUserId(null);
      },
    }),
    [dark, guestId, ready, userId]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
