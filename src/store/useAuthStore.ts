import { create } from 'zustand';

import {
  type AuthUser,
  fetchActivities,
  fetchCurrentUser,
  loginRequest,
  postActivity,
  registerRequest,
  type RemoteActivity,
} from '@/services/authApiService';
import {
  clearAuthToken,
  getAuthToken,
  saveAuthToken,
} from '@/services/secureTokenService';
import { fetchCloudState, pushCloudState } from '@/services/syncApiService';
import { useBookmarksStore } from '@/store/useBookmarksStore';
import { useProgressStore } from '@/store/useProgressStore';

export interface LocalActivityItem {
  id: string;
  actionType: string;
  targetId?: string;
  title: string;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  activities: LocalActivityItem[];
  isRestoring: boolean;
  restoreSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  syncStateToDb: () => Promise<void>;
  logActivity: (payload: {
    actionType: string;
    targetId?: string;
    title: string;
    metadata?: Record<string, unknown>;
  }) => Promise<void>;
}

let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;

async function hydrateFromCloud(token: string) {
  try {
    const cloud = await fetchCloudState(token);
    useProgressStore.getState().hydrateProgress({
      completedTopicIds: cloud.completedTopicIds,
      completedExampleIds: cloud.completedExampleIds,
      answeredQuestionResults: cloud.answeredQuestionResults,
      dailyGoalTarget: cloud.dailyGoalTarget,
      currentStreak: cloud.currentStreak,
      longestStreak: cloud.longestStreak,
      lastActiveDate: cloud.lastActiveDate,
    });
    useBookmarksStore.getState().hydrateBookmarks({
      bookmarkedExampleIds: cloud.bookmarkedExampleIds,
      bookmarkedQuestionIds: cloud.bookmarkedQuestionIds,
      notesById: cloud.notesById,
    });
  } catch {
    // Keep local state if cloud sync fails
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  activities: [],
  isRestoring: false,

  restoreSession: async () => {
    set({ isRestoring: true });
    try {
      const token = await getAuthToken();
      if (!token) {
        set({ isRestoring: false });
        return;
      }
      const [user, activities] = await Promise.all([
        fetchCurrentUser(token),
        fetchActivities(token),
      ]);
      await hydrateFromCloud(token);
      set({ user, activities, isRestoring: false });
    } catch {
      await clearAuthToken();
      set({ user: null, isRestoring: false });
    }
  },

  login: async (email, password) => {
    const normalized = email.trim().toLowerCase();
    try {
      const res = await loginRequest({ email: normalized, password });
      await saveAuthToken(res.token);
      const activities: RemoteActivity[] = await fetchActivities(res.token).catch(() => []);
      await hydrateFromCloud(res.token);
      set({ user: res.user, activities });
    } catch (err) {
      // Allow offline sign-in for the seeded developer account when backend is unreachable over tunnel
      const isNetworkError =
        err instanceof Error &&
        (err.message.includes('Network request failed') ||
          err.message.includes('fetch failed') ||
          err.message.includes('Aborted'));
      if (
        isNetworkError &&
        normalized === 'developer@interviewprep.app' &&
        password === 'Interview@2026'
      ) {
        set({
          user: {
            id: 'usr-developer-1',
            email: 'developer@interviewprep.app',
            name: 'Developer',
            createdAt: new Date().toISOString(),
          },
        });
        return;
      }
      throw err;
    }
  },

  register: async (email, password, name) => {
    const res = await registerRequest({ email, password, name });
    await saveAuthToken(res.token);
    const activities: RemoteActivity[] = await fetchActivities(res.token).catch(() => []);
    set({ user: res.user, activities });
    await get().syncStateToDb();
  },

  logout: async () => {
    await clearAuthToken();
    set({ user: null, activities: [] });
  },

  syncStateToDb: async () => {
    if (syncDebounceTimer) {
      clearTimeout(syncDebounceTimer);
    }
    syncDebounceTimer = setTimeout(async () => {
      const token = await getAuthToken();
      if (!token) return;
      const progress = useProgressStore.getState();
      const bookmarks = useBookmarksStore.getState();
      try {
        await pushCloudState(token, {
          completedTopicIds: progress.completedTopicIds,
          completedExampleIds: progress.completedExampleIds,
          answeredQuestionResults: progress.answeredQuestionResults,
          bookmarkedExampleIds: bookmarks.bookmarkedExampleIds,
          bookmarkedQuestionIds: bookmarks.bookmarkedQuestionIds,
          notesById: bookmarks.notesById,
          dailyGoalTarget: progress.dailyGoalTarget,
          currentStreak: progress.currentStreak,
          longestStreak: progress.longestStreak,
          lastActiveDate: progress.lastActiveDate,
        });
      } catch {
        // Keep local state if offline
      }
    }, 500);
  },

  logActivity: async (payload) => {
    const localEntry: LocalActivityItem = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actionType: payload.actionType,
      targetId: payload.targetId,
      title: payload.title,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      activities: [localEntry, ...state.activities].slice(0, 100),
    }));

    const token = await getAuthToken();
    if (!token) return;
    try {
      const [saved] = await Promise.all([
        postActivity(token, payload),
        get().syncStateToDb(),
      ]);
      set((state) => ({
        activities: state.activities.map((a) => (a.id === localEntry.id ? saved : a)),
      }));
    } catch {
      // Keep local entry if offline
    }
  },
}));
