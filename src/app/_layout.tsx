import { Stack, ThemeProvider, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppSplashScreen } from '@/components/ui/AppSplashScreen';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { useContentStore } from '@/store/useContentStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme, navigationTheme, isDark } = useAppTheme();
  const segments = useSegments();
  const syncFromBackend = useContentStore((s) => s.syncFromBackend);
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const user = useAuthStore((s) => s.user);
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    let active = true;
    const safetyTimer = setTimeout(() => {
      if (active) setBootReady(true);
    }, 1200);

    // Refresh curriculum in background without blocking app startup
    void syncFromBackend();

    async function boot() {
      try {
        await restoreSession();
      } finally {
        clearTimeout(safetyTimer);
        if (active) {
          setBootReady(true);
        }
      }
    }
    void boot();
    return () => {
      active = false;
      clearTimeout(safetyTimer);
    };
  }, [restoreSession, syncFromBackend]);

  useEffect(() => {
    if (!bootReady) return;
    const inAuthScreen = segments[0] === 'auth';
    if (!user && !inAuthScreen) {
      router.replace('/auth');
    } else if (user && inAuthScreen) {
      router.replace('/(tabs)');
    }
  }, [bootReady, user, segments]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          {!bootReady ? (
            <AppSplashScreen />
          ) : (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="category/[id]" />
              <Stack.Screen name="topic/[id]" />
              <Stack.Screen name="question/[id]" />
              <Stack.Screen name="mock-interview/setup" />
              <Stack.Screen name="mock-interview/session" />
              <Stack.Screen name="mock-interview/summary" />
              <Stack.Screen name="ai-coach/session" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="settings" />
            </Stack>
          )}
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
