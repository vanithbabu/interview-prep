import type { DifficultyLevel, InterviewQuestion, TechnologyId } from '@/types/content';

export type MockInterviewModeId =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'senior'
  | 'frontend'
  | 'react'
  | 'nextjs'
  | 'fullstack'
  | 'custom';

export interface MockInterviewModeConfig {
  id: MockInterviewModeId;
  title: string;
  description: string;
  defaultCount: number;
  secondsPerQuestion: number;
  difficulties: DifficultyLevel[];
  categories: TechnologyId[];
}

export interface MockAnswerEvaluation {
  questionId: string;
  questionTitle: string;
  userAnswer: string;
  score: number; // 1..10
  matchedConcepts: string[];
  missingConcepts: string[];
  expectedAnswer: string;
  improvedAnswer: string;
  timedOut: boolean;
}

export interface MockInterviewRecord {
  id: string;
  modeId: MockInterviewModeId;
  modeTitle: string;
  createdAtIso: string;
  averageScore: number;
  evaluations: MockAnswerEvaluation[];
}

export interface ActiveMockSession {
  id: string;
  modeId: MockInterviewModeId;
  modeTitle: string;
  secondsPerQuestion: number;
  questions: InterviewQuestion[];
  currentIndex: number;
  evaluations: MockAnswerEvaluation[];
}
