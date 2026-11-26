import { z } from 'zod';

import { getApiBaseUrl } from '@/services/apiBaseUrl';
import type {
  CategoryMeta,
  InterviewQuestion,
  TopicExample,
  TopicLesson,
} from '@/types/content';

const technologyIdSchema = z.enum([
  'javascript',
  'react',
  'nextjs',
  'wordpress',
  'php',
  'laravel',
  'mysql',
  'express',
  'ai',
  'typescript',
]);

const topicSummarySchema = z.object({
  id: z.string(),
  categoryId: technologyIdSchema,
  slug: z.string(),
  title: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'coding']),
  estimatedMinutes: z.number(),
  description: z.string(),
  exampleCount: z.number(),
});

const categorySchema = z.object({
  id: technologyIdSchema,
  name: z.string(),
  shortDescription: z.string(),
  icon: z.string(),
  accentColor: z.string(),
  topics: z.array(topicSummarySchema),
});

const questionSchema = z.object({
  id: z.string(),
  categoryId: technologyIdSchema,
  topicId: z.string().optional(),
  title: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  shortAnswer: z.string(),
  detailedExplanation: z.string(),
  humanInterviewAnswer: z.string(),
  practicalExample: z.string(),
  codeExample: z
    .object({
      language: z.string(),
      code: z.string(),
      expectedOutput: z.string(),
    })
    .optional(),
  followUpQuestions: z.array(z.string()),
  interviewerExpectations: z.array(z.string()),
  keyConcepts: z.array(z.string()),
  tags: z.array(z.string()),
});

const bootstrapSchema = z.object({
  categories: z.array(categorySchema),
  questions: z.array(questionSchema),
  syncedAtIso: z.string(),
});

const API_BASE_URL = getApiBaseUrl();

const topicLessonSchema = z.object({
  id: z.string(),
  categoryId: technologyIdSchema,
  categoryName: z.string(),
  title: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'coding']),
  estimatedMinutes: z.number(),
  coreQuestion: z.string(),
  simpleHumanAnswer: z.string(),
  realWorldExample: z.string(),
  codeExamples: z.array(
    z.object({
      title: z.string(),
      language: z.string(),
      code: z.string(),
      expectedOutput: z.string(),
    })
  ),
  interviewSpeakingAnswer: z.string(),
  followUpQuestions: z.array(z.string()),
  followUpAnswers: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
});

export async function fetchBootstrapContent(): Promise<{
  categories: CategoryMeta[];
  questions: InterviewQuestion[];
  syncedAtIso: string;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/content/bootstrap`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Content sync failed (${response.status})`);
    }
    const raw: unknown = await response.json();
    return bootstrapSchema.parse(raw);
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchTopicLesson(topicId: string): Promise<TopicLesson> {
  const response = await fetch(`${API_BASE_URL}/api/v1/content/topics/${encodeURIComponent(topicId)}`);
  if (!response.ok) {
    throw new Error(`Failed to load topic (${response.status})`);
  }
  const raw: unknown = await response.json();
  const parsed = z.object({ lesson: topicLessonSchema }).parse(raw);
  return parsed.lesson;
}

const topicExampleSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  groupTitle: z.string(),
  concept: z.string(),
  syntax: z.string(),
  code: z.string(),
  expectedOutput: z.string(),
  explanation: z.string(),
  realWorldUsage: z.string(),
  interviewTip: z.string(),
});

export async function generateTopicExamplesBatchAI(
  topicId: string,
  batchStart: 1 | 11 | 21 | 31 | 41
): Promise<{ examples: TopicExample[]; source: 'local_llm' | 'seed' }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/content/topics/${encodeURIComponent(topicId)}/generate-examples`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchStart }),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to load examples (${response.status})`);
  }
  const raw: unknown = await response.json();
  return z
    .object({
      examples: z.array(topicExampleSchema),
      source: z.enum(['local_llm', 'seed']),
    })
    .parse(raw);
}

export async function generateTopicLessonAI(
  topicId: string
): Promise<{ lesson: TopicLesson; source: 'local_llm' | 'seed' }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/content/topics/${encodeURIComponent(topicId)}/generate`,
    { method: 'POST' }
  );
  if (!response.ok) {
    throw new Error(`Failed to generate topic (${response.status})`);
  }
  const raw: unknown = await response.json();
  return z
    .object({
      lesson: topicLessonSchema,
      source: z.enum(['local_llm', 'seed']),
    })
    .parse(raw);
}
