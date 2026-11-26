import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CATEGORIES } from '@/content/categories';
import { ALL_QUESTIONS } from '@/content/questions';
import { fetchBootstrapContent } from '@/services/contentApiService';
import { asyncStorageAdapter } from '@/services/storage';
import type { CategoryMeta, InterviewQuestion } from '@/types/content';

interface ContentState {
  categories: CategoryMeta[];
  questions: InterviewQuestion[];
  lastSyncedAt: string | null;
  isSyncing: boolean;
  syncError: string | null;
  syncFromBackend: () => Promise<void>;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      categories: CATEGORIES,
      questions: ALL_QUESTIONS,
      lastSyncedAt: null,
      isSyncing: false,
      syncError: null,

      syncFromBackend: async () => {
        if (get().isSyncing) return;
        set({ isSyncing: true, syncError: null });
        try {
          const data = await fetchBootstrapContent();
          set({
            categories: data.categories,
            questions: data.questions,
            lastSyncedAt: data.syncedAtIso,
            isSyncing: false,
          });
        } catch (err: unknown) {
          set({
            isSyncing: false,
            syncError: err instanceof Error ? err.message : 'Offline mode active',
          });
        }
      },
    }),
    {
      name: 'interview-prep-content-cache',
      storage: asyncStorageAdapter,
      partialize: (state) => ({
        categories: state.categories,
        questions: state.questions,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
