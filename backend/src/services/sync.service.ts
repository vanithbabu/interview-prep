import { prisma } from '../config/prisma.js';

export interface SyncUserStatePayload {
  completedTopicIds: string[];
  completedExampleIds: string[];
  answeredQuestionResults: Record<string, 'correct' | 'review'>;
  bookmarkedQuestionIds: string[];
  bookmarkedExampleIds: string[];
  notesById: Record<string, string>;
  dailyGoalTarget: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

const memoryStateByUser = new Map<string, SyncUserStatePayload>();

const DEFAULT_STATE: SyncUserStatePayload = {
  completedTopicIds: [],
  completedExampleIds: [],
  answeredQuestionResults: {},
  bookmarkedQuestionIds: [],
  bookmarkedExampleIds: [],
  notesById: {},
  dailyGoalTarget: 5,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
};

export async function getUserSyncState(userId: string): Promise<SyncUserStatePayload> {
  try {
    const row = await prisma.userState.findUnique({ where: { userId } });
    if (!row) {
      return memoryStateByUser.get(userId) ?? DEFAULT_STATE;
    }
    return {
      completedTopicIds: row.completedTopicIds,
      completedExampleIds: row.completedExampleIds,
      answeredQuestionResults:
        (row.answeredQuestionResultsJson as Record<string, 'correct' | 'review'>) ?? {},
      bookmarkedQuestionIds: row.bookmarkedQuestionIds,
      bookmarkedExampleIds: row.bookmarkedExampleIds,
      notesById: (row.notesJson as Record<string, string>) ?? {},
      dailyGoalTarget: row.dailyGoalTarget,
      currentStreak: row.currentStreak,
      longestStreak: row.longestStreak,
      lastActiveDate: row.lastActiveDate,
    };
  } catch {
    return memoryStateByUser.get(userId) ?? DEFAULT_STATE;
  }
}

export async function saveUserSyncState(
  userId: string,
  payload: SyncUserStatePayload
): Promise<SyncUserStatePayload> {
  memoryStateByUser.set(userId, payload);
  try {
    await prisma.userState.upsert({
      where: { userId },
      update: {
        completedTopicIds: payload.completedTopicIds,
        completedExampleIds: payload.completedExampleIds,
        answeredQuestionResultsJson: payload.answeredQuestionResults,
        bookmarkedQuestionIds: payload.bookmarkedQuestionIds,
        bookmarkedExampleIds: payload.bookmarkedExampleIds,
        notesJson: payload.notesById,
        dailyGoalTarget: payload.dailyGoalTarget,
        currentStreak: payload.currentStreak,
        longestStreak: payload.longestStreak,
        lastActiveDate: payload.lastActiveDate,
      },
      create: {
        userId,
        completedTopicIds: payload.completedTopicIds,
        completedExampleIds: payload.completedExampleIds,
        answeredQuestionResultsJson: payload.answeredQuestionResults,
        bookmarkedQuestionIds: payload.bookmarkedQuestionIds,
        bookmarkedExampleIds: payload.bookmarkedExampleIds,
        notesJson: payload.notesById,
        dailyGoalTarget: payload.dailyGoalTarget,
        currentStreak: payload.currentStreak,
        longestStreak: payload.longestStreak,
        lastActiveDate: payload.lastActiveDate,
      },
    });
  } catch {
    // Kept in memoryStateByUser when Postgres is offline
  }
  return payload;
}
