import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { evaluateMockAnswer, selectQuestionsForMock } from '@/services/evaluationService';
import { asyncStorageAdapter } from '@/services/storage';
import { useContentStore } from '@/store/useContentStore';
import type { DifficultyLevel, TechnologyId } from '@/types/content';
import type {
  ActiveMockSession,
  MockAnswerEvaluation,
  MockInterviewModeId,
  MockInterviewRecord,
} from '@/types/interview';

interface InterviewState {
  history: MockInterviewRecord[];
  activeSession: ActiveMockSession | null;
  lastCompletedRecord: MockInterviewRecord | null;
  startSession: (params: {
    modeId: MockInterviewModeId;
    modeTitle: string;
    categories: TechnologyId[];
    difficulties: DifficultyLevel[];
    count: number;
    secondsPerQuestion: number;
  }) => void;
  submitCurrentAnswer: (userAnswer: string, timedOut?: boolean) => MockAnswerEvaluation | null;
  advanceOrFinish: () => MockInterviewRecord | null;
  clearActiveSession: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      history: [],
      activeSession: null,
      lastCompletedRecord: null,

      startSession: ({
        modeId,
        modeTitle,
        categories,
        difficulties,
        count,
        secondsPerQuestion,
      }) => {
        const allQuestions = useContentStore.getState().questions;
        const questions = selectQuestionsForMock({
          questions: allQuestions,
          categories,
          difficulties,
          count,
        });
        set({
          activeSession: {
            id: `mock-${Date.now()}`,
            modeId,
            modeTitle,
            secondsPerQuestion,
            questions,
            currentIndex: 0,
            evaluations: [],
          },
        });
      },

      submitCurrentAnswer: (userAnswer, timedOut = false) => {
        const session = get().activeSession;
        if (!session) return null;

        const question = session.questions[session.currentIndex];
        if (!question) return null;

        const evaluation = evaluateMockAnswer({ question, userAnswer, timedOut });

        set({
          activeSession: {
            ...session,
            evaluations: [...session.evaluations, evaluation],
          },
        });

        return evaluation;
      },

      advanceOrFinish: () => {
        const session = get().activeSession;
        if (!session) return null;

        const nextIndex = session.currentIndex + 1;
        if (nextIndex < session.questions.length) {
          set({
            activeSession: {
              ...session,
              currentIndex: nextIndex,
            },
          });
          return null;
        }

        const total = session.evaluations.reduce((sum, e) => sum + e.score, 0);
        const averageScore =
          session.evaluations.length > 0
            ? Math.round((total / session.evaluations.length) * 10) / 10
            : 0;

        const record: MockInterviewRecord = {
          id: session.id,
          modeId: session.modeId,
          modeTitle: session.modeTitle,
          createdAtIso: new Date().toISOString(),
          averageScore,
          evaluations: session.evaluations,
        };

        set((state) => ({
          history: [record, ...state.history].slice(0, 30),
          activeSession: null,
          lastCompletedRecord: record,
        }));

        return record;
      },

      clearActiveSession: () => set({ activeSession: null }),
    }),
    {
      name: 'interview-prep-mock-sessions',
      storage: asyncStorageAdapter,
      partialize: (state) => ({
        history: state.history,
        lastCompletedRecord: state.lastCompletedRecord,
      }),
    }
  )
);
