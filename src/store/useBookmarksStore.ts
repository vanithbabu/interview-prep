import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncStorageAdapter } from '@/services/storage';

interface BookmarksState {
  bookmarkedExampleIds: string[];
  bookmarkedQuestionIds: string[];
  notesById: Record<string, string>;
  toggleBookmarkExample: (exampleId: string) => void;
  toggleBookmarkQuestion: (questionId: string) => void;
  saveNote: (itemId: string, note: string) => void;
  hydrateBookmarks: (data: {
    bookmarkedExampleIds: string[];
    bookmarkedQuestionIds: string[];
    notesById: Record<string, string>;
  }) => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarkedExampleIds: [],
      bookmarkedQuestionIds: [],
      notesById: {},

      toggleBookmarkExample: (exampleId) => {
        const current = get().bookmarkedExampleIds;
        const exists = current.includes(exampleId);
        set({
          bookmarkedExampleIds: exists
            ? current.filter((id) => id !== exampleId)
            : [...current, exampleId],
        });
      },

      toggleBookmarkQuestion: (questionId) => {
        const current = get().bookmarkedQuestionIds;
        const exists = current.includes(questionId);
        set({
          bookmarkedQuestionIds: exists
            ? current.filter((id) => id !== questionId)
            : [...current, questionId],
        });
      },

      saveNote: (itemId, note) => {
        const trimmed = note.slice(0, 2000);
        set((state) => ({
          notesById: {
            ...state.notesById,
            [itemId]: trimmed,
          },
        }));
      },

      hydrateBookmarks: (data) =>
        set({
          bookmarkedExampleIds: data.bookmarkedExampleIds,
          bookmarkedQuestionIds: data.bookmarkedQuestionIds,
          notesById: data.notesById,
        }),
    }),
    {
      name: 'interview-prep-bookmarks',
      storage: asyncStorageAdapter,
    }
  )
);
