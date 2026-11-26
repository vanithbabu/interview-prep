import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_AI_PROXY_URL;
  if (configured) return configured;

  if (Platform.OS !== 'web') {
    const hostUri = Constants.expoConfig?.hostUri;
    const host = hostUri?.split(':')[0];
    // Expo tunnel domains (*.on.expo.app / *.exp.direct) only tunnel Metro, not port 4000
    if (host && !host.includes('expo.app') && !host.includes('exp.direct')) {
      return `http://${host}:4000`;
    }
  }

  return 'http://localhost:4000';
}
