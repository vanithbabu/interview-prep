export type TechnologyId =
  | 'javascript'
  | 'react'
  | 'nextjs'
  | 'wordpress'
  | 'php'
  | 'laravel'
  | 'mysql'
  | 'ai'
  | 'typescript';

export type DifficultyLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'coding';

export interface TopicSummary {
  id: string;
  categoryId: TechnologyId;
  slug: string;
  title: string;
  level: DifficultyLevel;
  estimatedMinutes: number;
  description: string;
  exampleCount: number;
}

export interface CategoryMeta {
  id: TechnologyId;
  name: string;
  shortDescription: string;
  icon: string;
  accentColor: string;
  topics: TopicSummary[];
}

export interface DailyQuickWin {
  id: string;
  categoryId: TechnologyId;
  question: string;
  codeSnippet?: string;
  answer: string;
}

export interface TopicExample {
  id: string; // e.g., "js-functions:1"
  number: number; // 1..50
  title: string;
  groupTitle: string;
  concept: string;
  syntax: string;
  code: string;
  expectedOutput: string;
  explanation: string;
  realWorldUsage: string;
  interviewTip: string;
}

export interface TopicQuestionItem {
  id: string;
  level: DifficultyLevel | 'senior';
  question: string;
  spokenAnswer: string;
  detailedAnswer: string;
  followUps: Array<{
    question: string;
    answer: string;
  }>;
}

export interface PracticeExercise {
  id: string;
  title: string;
  prompt: string;
  hint: string;
  solutionCode: string;
  expectedOutput: string;
}

export interface TopicDetail {
  id: string;
  categoryId: TechnologyId;
  title: string;
  level: DifficultyLevel;
  estimatedMinutes: number;
  introduction: string;
  simpleExplanation: string;
  whyWeUseIt: string;
  howItWorksInternally: string;
  syntaxVariations: Array<{
    label: string;
    pattern: string;
  }>;
  examples: TopicExample[];
  realWorldUsage: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: TopicQuestionItem[];
  practicalExercises: PracticeExercise[];
  advancedUseCases: string[];
}

export interface InterviewQuestion {
  id: string;
  categoryId: TechnologyId;
  topicId?: string;
  title: string;
  difficulty: DifficultyLevel;
  shortAnswer: string;
  detailedExplanation: string;
  humanInterviewAnswer: string;
  practicalExample: string;
  codeExample?: {
    language: string;
    code: string;
    expectedOutput: string;
  };
  followUpQuestions: string[];
  interviewerExpectations: string[];
  keyConcepts: string[];
  tags: string[];
}

export interface TopicLessonCodeExample {
  title: string;
  language: string;
  code: string;
  expectedOutput: string;
}

export interface TopicLesson {
  id: string;
  categoryId: TechnologyId;
  categoryName: string;
  title: string;
  level: DifficultyLevel;
  estimatedMinutes: number;
  coreQuestion: string;
  simpleHumanAnswer: string;
  realWorldExample: string;
  codeExamples: TopicLessonCodeExample[];
  interviewSpeakingAnswer: string;
  followUpQuestions: string[];
  followUpAnswers?: Array<{ question: string; answer: string }>;
}
