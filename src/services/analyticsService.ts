import type { CategoryMeta, InterviewQuestion } from '@/types/content';
import type { MockInterviewRecord } from '@/types/interview';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  earned: boolean;
}

export interface ProgressAnalytics {
  totalTopics: number;
  completedTopicsCount: number;
  overallTopicRatio: number;
  completedExamplesCount: number;
  answeredCount: number;
  correctCount: number;
  reviewCount: number;
  weakQuestions: InterviewQuestion[];
  averageMockScore: number | null;
  milestones: Milestone[];
  categoryProgress: Array<{
    id: string;
    name: string;
    accentColor: string;
    completed: number;
    total: number;
    ratio: number;
  }>;
}

export function computeProgressAnalytics(params: {
  categories: CategoryMeta[];
  questions: InterviewQuestion[];
  completedTopicIds: string[];
  completedExampleIds: string[];
  answeredQuestionResults: Record<string, 'correct' | 'review'>;
  currentStreak: number;
  longestStreak: number;
  mockHistory: MockInterviewRecord[];
}): ProgressAnalytics {
  const {
    categories,
    questions,
    completedTopicIds,
    completedExampleIds,
    answeredQuestionResults,
    currentStreak,
    longestStreak,
    mockHistory,
  } = params;

  const allTopics = categories.flatMap((c) => c.topics);
  const totalTopics = allTopics.length;
  const completedTopicsCount = completedTopicIds.length;
  const overallTopicRatio = totalTopics > 0 ? completedTopicsCount / totalTopics : 0;

  const entries = Object.entries(answeredQuestionResults);
  const answeredCount = entries.length;
  const correctCount = entries.filter(([, r]) => r === 'correct').length;
  const reviewCount = entries.filter(([, r]) => r === 'review').length;

  const reviewIds = new Set(
    entries.filter(([, r]) => r === 'review').map(([id]) => id)
  );
  const weakQuestions = questions.filter((q) => reviewIds.has(q.id));

  const averageMockScore =
    mockHistory.length > 0
      ? Math.round(
          (mockHistory.reduce((sum, m) => sum + m.averageScore, 0) / mockHistory.length) *
            10
        ) / 10
      : null;

  const categoryProgress = categories.map((cat) => {
    const completed = cat.topics.filter((t) => completedTopicIds.includes(t.id)).length;
    const total = cat.topics.length;
    return {
      id: cat.id,
      name: cat.name,
      accentColor: cat.accentColor,
      completed,
      total,
      ratio: total > 0 ? completed / total : 0,
    };
  });

  const milestones: Milestone[] = [
    {
      id: 'm-first-step',
      title: 'First Step',
      description: 'Complete your first example, Q&A, or topic.',
      earned:
        completedExampleIds.length >= 1 || answeredCount >= 1 || completedTopicsCount >= 1,
    },
    {
      id: 'm-10-examples',
      title: '10 Code Examples',
      description: 'Master 10 practical code examples.',
      earned: completedExampleIds.length >= 10,
    },
    {
      id: 'm-7-streak',
      title: '7-Day Streak',
      description: 'Stay consistent for 7 consecutive days.',
      earned: Math.max(currentStreak, longestStreak) >= 7,
    },
    {
      id: 'm-mock-ready',
      title: 'Mock Interview Finisher',
      description: 'Complete at least 1 timed mock interview.',
      earned: mockHistory.length >= 1,
    },
  ];

  return {
    totalTopics,
    completedTopicsCount,
    overallTopicRatio,
    completedExamplesCount: completedExampleIds.length,
    answeredCount,
    correctCount,
    reviewCount,
    weakQuestions,
    averageMockScore,
    milestones,
    categoryProgress,
  };
}
