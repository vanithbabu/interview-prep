import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncStorageAdapter } from '@/services/storage';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  hapticsEnabled: boolean;
  setPreference: (preference: ThemePreference) => void;
  setHapticsEnabled: (enabled: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      hapticsEnabled: true,
      setPreference: (preference) => set({ preference }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
    }),
    {
      name: 'interview-prep-theme',
      storage: asyncStorageAdapter,
    }
  )
);
