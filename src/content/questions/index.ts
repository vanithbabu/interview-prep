import { JAVASCRIPT_QUESTIONS } from '@/content/questions/javascript';
import type { InterviewQuestion } from '@/types/content';

export const ALL_QUESTIONS: InterviewQuestion[] = [...JAVASCRIPT_QUESTIONS];

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

export function getRecommendedQuestions(limit = 4): InterviewQuestion[] {
  return ALL_QUESTIONS.slice(0, limit);
}
