import type { TechnologyId } from '@/types/content';

export type AICoachLevel = 'beginner' | 'intermediate' | 'advanced' | 'senior';

export interface AICoachHistoryTurn {
  question: string;
  answer: string;
  score: number;
}

export interface AICoachTurnRequest {
  sessionId: string;
  categoryId?: 'all' | TechnologyId;
  role: string;
  level: AICoachLevel;
  questionIndex: number;
  currentQuestion: string;
  candidateAnswer: string;
  history: AICoachHistoryTurn[];
}

export interface AICoachTurnResponse {
  evaluation: {
    score: number;
    isTechnicallyAccurate: boolean;
    strengths: string[];
    missingConcepts: string[];
    mistakesExplained: string[];
    betterAnswer: string;
  };
  nextAction: 'follow_up' | 'next_question' | 'final_report';
  nextPrompt?: string;
  finalReport?: {
    overallScore: number;
    readinessLevel: string;
    topStrengths: string[];
    weakTopics: string[];
    actionPlan: string[];
  };
}
