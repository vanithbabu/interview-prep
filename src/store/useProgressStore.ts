import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncStorageAdapter } from '@/services/storage';
import { calculateUpdatedStreak, getTodayDateKey } from '@/services/streakService';
import { useAuthStore } from '@/store/useAuthStore';
import type { TechnologyId } from '@/types/content';

export interface LastViewedTopic {
  topicId: string;
  categoryId: TechnologyId;
  title: string;
  exampleNumber: number;
}

export interface RecentMockScore {
  id: string;
  modeLabel: string;
  score: number;
  dateIso: string;
}

interface ProgressState {
  completedTopicIds: string[];
  completedExampleIds: string[];
  answeredQuestionResults: Record<string, 'correct' | 'review'>;
  lastExampleByTopic: Record<string, number>;
  lastViewedTopic: LastViewedTopic | null;
  dailyGoalTarget: number;
  todayActivityDate: string;
  todayActivityCount: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  recentMockScores: RecentMockScore[];
  recordActivity: (units?: number) => void;
  toggleTopicCompleted: (topicId: string) => void;
  toggleExampleCompleted: (exampleId: string) => void;
  markQuestionResult: (questionId: string, result: 'correct' | 'review') => void;
  setLastExampleForTopic: (topicId: string, exampleNumber: number) => void;
  setLastViewedTopic: (topic: LastViewedTopic) => void;
  setDailyGoalTarget: (target: number) => void;
  addRecentMockScore: (score: RecentMockScore) => void;
  hydrateProgress: (data: {
    completedTopicIds: string[];
    completedExampleIds: string[];
    answeredQuestionResults: Record<string, 'correct' | 'review'>;
    dailyGoalTarget: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
  }) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedTopicIds: [],
      completedExampleIds: [],
      answeredQuestionResults: {},
      lastExampleByTopic: {},
      lastViewedTopic: {
        topicId: 'js-functions',
        categoryId: 'javascript',
        title: 'Functions, Arrow Functions & Parameters',
        exampleNumber: 1,
      },
      dailyGoalTarget: 5,
      todayActivityDate: getTodayDateKey(),
      todayActivityCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      recentMockScores: [],

      recordActivity: (units = 1) => {
        const todayKey = getTodayDateKey();
        const state = get();
        const baseCount = state.todayActivityDate === todayKey ? state.todayActivityCount : 0;
        const streakUpdate = calculateUpdatedStreak({
          lastActiveDate: state.lastActiveDate,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          todayKey,
        });

        set({
          todayActivityDate: todayKey,
          todayActivityCount: baseCount + units,
          ...streakUpdate,
        });
      },

      toggleTopicCompleted: (topicId) => {
        const state = get();
        const exists = state.completedTopicIds.includes(topicId);
        const completedTopicIds = exists
          ? state.completedTopicIds.filter((id) => id !== topicId)
          : [...state.completedTopicIds, topicId];

        set({ completedTopicIds });
        if (!exists) {
          get().recordActivity(1);
          void useAuthStore.getState().logActivity({
            actionType: 'TOPIC_COMPLETED',
            targetId: topicId,
            title: `Completed topic: ${topicId}`,
          });
        }
      },

      toggleExampleCompleted: (exampleId) => {
        const state = get();
        const exists = state.completedExampleIds.includes(exampleId);
        const completedExampleIds = exists
          ? state.completedExampleIds.filter((id) => id !== exampleId)
          : [...state.completedExampleIds, exampleId];

        set({ completedExampleIds });
        if (!exists) {
          get().recordActivity(1);
          void useAuthStore.getState().logActivity({
            actionType: 'EXAMPLE_COMPLETED',
            targetId: exampleId,
            title: `Completed example ${exampleId}`,
          });
        }
      },

      markQuestionResult: (questionId, result) => {
        set((state) => ({
          answeredQuestionResults: {
            ...state.answeredQuestionResults,
            [questionId]: result,
          },
        }));
        get().recordActivity(1);
        void useAuthStore.getState().logActivity({
          actionType: 'QUESTION_ANSWERED',
          targetId: questionId,
          title: `Marked Q&A (${result}): ${questionId}`,
        });
      },

      setLastExampleForTopic: (topicId, exampleNumber) => {
        set((state) => ({
          lastExampleByTopic: {
            ...state.lastExampleByTopic,
            [topicId]: exampleNumber,
          },
        }));
      },

      setLastViewedTopic: (lastViewedTopic) => set({ lastViewedTopic }),

      setDailyGoalTarget: (dailyGoalTarget) =>
        set({ dailyGoalTarget: Math.max(1, Math.min(50, dailyGoalTarget)) }),

      addRecentMockScore: (score) => {
        set((state) => ({
          recentMockScores: [score, ...state.recentMockScores].slice(0, 10),
        }));
        get().recordActivity(2);
        void useAuthStore.getState().logActivity({
          actionType: 'MOCK_INTERVIEW_COMPLETED',
          targetId: score.id,
          title: `Completed ${score.modeLabel} (${score.score}/10)`,
        });
      },

      hydrateProgress: (data) =>
        set({
          completedTopicIds: data.completedTopicIds,
          completedExampleIds: data.completedExampleIds,
          answeredQuestionResults: data.answeredQuestionResults,
          dailyGoalTarget: data.dailyGoalTarget,
          currentStreak: data.currentStreak,
          longestStreak: data.longestStreak,
          lastActiveDate: data.lastActiveDate,
        }),
    }),
    {
      name: 'interview-prep-progress',
      storage: asyncStorageAdapter,
    }
  )
);
