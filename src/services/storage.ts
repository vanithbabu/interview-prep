import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Shared AsyncStorage adapter for Zustand persist middleware.
 * Only store non-sensitive app preferences, learning progress, bookmarks, and notes here.
 */
export const asyncStorageAdapter = createJSONStorage(() => AsyncStorage);
