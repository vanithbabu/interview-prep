import { z } from 'zod';

import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { CATEGORIES_FEED, type BackendCategoryMeta } from '../data/categoriesFeed.js';
import { ALL_QUESTIONS_FEED, type BackendQuestionFeed } from '../data/questionsFeed.js';
import { resolveFollowUpAnswer } from '../data/followUpAnswers.js';
import { getTopicLessonById, type TopicLesson } from '../data/topicLessonsFeed.js';

const generatedLessonSchema = z.object({
  coreQuestion: z.string(),
  simpleHumanAnswer: z.string(),
  realWorldExample: z.string(),
  codeExamples: z
    .array(
      z.object({
        title: z.string(),
        language: z.string(),
        code: z.string(),
        expectedOutput: z.string(),
      })
    )
    .min(1),
  interviewSpeakingAnswer: z.string(),
  followUpQuestions: z.array(z.string()).min(1),
});

const generatedCache = new Map<string, TopicLesson>();

export interface TopicExampleItem {
  id: string;
  number: number;
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

const examplesBatchSchema = z.object({
  examples: z
    .array(
      z.object({
        title: z.string(),
        concept: z.string(),
        syntax: z.string(),
        code: z.string(),
        expectedOutput: z.string(),
        explanation: z.string(),
        realWorldUsage: z.string(),
        interviewTip: z.string(),
      })
    )
    .min(1),
});

const examplesBatchCache = new Map<string, TopicExampleItem[]>();

function buildFallbackExamplesBatch(
  lesson: TopicLesson,
  batchStart: number
): TopicExampleItem[] {
  const groupEnd = batchStart + 9;
  const groupTitle = `${lesson.title} (${batchStart}–${groupEnd})`;
  const lang = lesson.categoryName === 'WordPress' ? 'PHP' : 'JavaScript';

  return Array.from({ length: 10 }, (_, idx) => {
    const num = batchStart + idx;
    const seedEx = lesson.codeExamples[idx % lesson.codeExamples.length];
    return {
      id: `${lesson.id}:${num}`,
      number: num,
      title: `${seedEx?.title ?? lesson.title} — Variation #${num}`,
      groupTitle,
      concept: `Practical ${lesson.level} pattern #${num} for ${lesson.title}.`,
      syntax: seedEx?.language ? `${seedEx.language} pattern` : `${lang} pattern`,
      code:
        seedEx?.code ??
        `// ${lesson.title} - Example ${num}\nconsole.log('Example ${num}: ${lesson.title}');`,
      expectedOutput: seedEx?.expectedOutput ?? `Example ${num}: ${lesson.title}`,
      explanation: `Demonstrates how ${lesson.title} works in scenario #${num} with clean, readable structure.`,
      realWorldUsage: lesson.realWorldExample,
      interviewTip: lesson.interviewSpeakingAnswer,
    };
  });
}

export async function generateTopicExamplesBatch(
  topicId: string,
  batchStart: number
): Promise<{ examples: TopicExampleItem[]; source: 'local_llm' | 'seed' } | undefined> {
  const lesson = getDynamicTopicLesson(topicId);
  if (!lesson) return undefined;

  const cacheKey = `${topicId}:${batchStart}`;
  const cached = examplesBatchCache.get(cacheKey);
  if (cached) {
    return { examples: cached, source: 'local_llm' };
  }

  const groupEnd = batchStart + 9;
  const groupTitle = `${lesson.title} (${batchStart}–${groupEnd})`;

  if (env.AI_PROVIDER !== 'local') {
    return { examples: buildFallbackExamplesBatch(lesson, batchStart), source: 'seed' };
  }

  const prompt = `Generate 10 distinct, non-repetitive practical coding examples (numbered ${batchStart} to ${groupEnd}) for "${lesson.categoryName} - ${lesson.title}" (${lesson.level} level).
Each example must teach a DIFFERENT variation, syntax, edge case, or real-world use case.
Return ONLY valid JSON:
{
  "examples": [
    {
      "title": string,
      "concept": string,
      "syntax": string,
      "code": string,
      "expectedOutput": string,
      "explanation": string,
      "realWorldUsage": string,
      "interviewTip": string
    }
  ]
}`;

  try {
    const response = await fetch(`${env.LOCAL_AI_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.LOCAL_AI_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are a senior developer creating distinct, accurate coding examples.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return { examples: buildFallbackExamplesBatch(lesson, batchStart), source: 'seed' };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) {
      return { examples: buildFallbackExamplesBatch(lesson, batchStart), source: 'seed' };
    }

    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const parsed = examplesBatchSchema.parse(JSON.parse(cleaned));

    const formatted: TopicExampleItem[] = parsed.examples.slice(0, 10).map((ex, idx) => ({
      id: `${topicId}:${batchStart + idx}`,
      number: batchStart + idx,
      groupTitle,
      ...ex,
    }));

    examplesBatchCache.set(cacheKey, formatted);
    return { examples: formatted, source: 'local_llm' };
  } catch {
    return { examples: buildFallbackExamplesBatch(lesson, batchStart), source: 'seed' };
  }
}

export async function getDynamicCategoriesFromDb(): Promise<BackendCategoryMeta[]> {
  try {
    const rows = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { topics: true },
    });
    if (rows.length === 0) return CATEGORIES_FEED;
    return rows.map((cat) => ({
      id: cat.id as BackendCategoryMeta['id'],
      name: cat.name,
      shortDescription: cat.shortDescription,
      icon: cat.icon,
      accentColor: cat.accentColor,
      topics: cat.topics.map((t) => ({
        id: t.id,
        categoryId: cat.id as BackendCategoryMeta['id'],
        slug: t.slug,
        title: t.title,
        level: t.level as BackendCategoryMeta['topics'][number]['level'],
        estimatedMinutes: t.estimatedMinutes,
        description: t.description,
        exampleCount: 50,
      })),
    }));
  } catch {
    return CATEGORIES_FEED;
  }
}

export function getDynamicCategories(): BackendCategoryMeta[] {
  return CATEGORIES_FEED;
}

export function getDynamicQuestions(filters?: {
  categoryId?: string;
  difficulty?: string;
  q?: string;
}): BackendQuestionFeed[] {
  const query = filters?.q?.trim().toLowerCase();
  return ALL_QUESTIONS_FEED.filter((item) => {
    if (filters?.categoryId && filters.categoryId !== 'all' && item.categoryId !== filters.categoryId) {
      return false;
    }
    if (filters?.difficulty && filters.difficulty !== 'all' && item.difficulty !== filters.difficulty) {
      return false;
    }
    if (query) {
      return (
        item.title.toLowerCase().includes(query) ||
        item.shortAnswer.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });
}

export function getDynamicQuestionById(id: string): BackendQuestionFeed | undefined {
  return ALL_QUESTIONS_FEED.find((q) => q.id === id);
}

function withFollowUpAnswers(lesson: TopicLesson): TopicLesson {
  if (lesson.followUpAnswers && lesson.followUpAnswers.length > 0) {
    return lesson;
  }
  return {
    ...lesson,
    followUpAnswers: lesson.followUpQuestions.map((question) => ({
      question,
      answer: resolveFollowUpAnswer(question, lesson.title, lesson.categoryName),
    })),
  };
}

export function getDynamicTopicLesson(id: string): TopicLesson | undefined {
  const cached = generatedCache.get(id);
  if (cached) return withFollowUpAnswers(cached);

  const exact = getTopicLessonById(id);
  if (exact) return withFollowUpAnswers(exact);

  for (const cat of CATEGORIES_FEED) {
    const summary = cat.topics.find((t) => t.id === id);
    if (summary) {
      return withFollowUpAnswers({
        id: summary.id,
        categoryId: summary.categoryId,
        categoryName: cat.name,
        title: summary.title,
        level: summary.level,
        estimatedMinutes: summary.estimatedMinutes,
        coreQuestion: `What is ${summary.title}, and how do you use it in production?`,
        simpleHumanAnswer: summary.description,
        realWorldExample: `Used across real-world ${cat.name} applications to keep code maintainable, scalable, and predictable.`,
        codeExamples: [
          {
            title: `Example 1: Core ${summary.title} Pattern`,
            language: cat.name === 'WordPress' ? 'PHP' : 'TypeScript',
            code: `// ${summary.title}\n// Practice this concept in ${cat.name} (${summary.level})`,
            expectedOutput: `Demonstrates ${summary.title} cleanly.`,
          },
        ],
        interviewSpeakingAnswer: `${summary.title} is a core ${cat.name} concept: ${summary.description}`,
        followUpQuestions: [
          `Why do we use ${summary.title}?`,
          `What are common mistakes with ${summary.title}?`,
        ],
      });
    }
  }
  return undefined;
}

export async function generateTopicLessonWithLocalAI(
  id: string
): Promise<{ lesson: TopicLesson; source: 'local_llm' | 'seed' } | undefined> {
  const base = getDynamicTopicLesson(id);
  if (!base) return undefined;

  if (env.AI_PROVIDER !== 'local') {
    return { lesson: base, source: 'seed' };
  }

  const prompt = `Generate a crisp, human-readable developer interview lesson for "${base.categoryName} - ${base.title}" (${base.level} level).
Return ONLY valid JSON with:
{
  "coreQuestion": string,
  "simpleHumanAnswer": string (2-3 simple sentences),
  "realWorldExample": string (concrete project scenario),
  "codeExamples": [{ "title": string, "language": "${base.categoryName === 'WordPress' ? 'PHP' : 'JavaScript'}", "code": string, "expectedOutput": string }] (provide 3 distinct practical examples),
  "interviewSpeakingAnswer": string (natural 60-second spoken answer),
  "followUpQuestions": string[] (3 realistic follow-ups)
}`;

  try {
    const response = await fetch(`${env.LOCAL_AI_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.LOCAL_AI_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a senior software engineer writing clear, accurate interview prep lessons.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return { lesson: base, source: 'seed' };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) return { lesson: base, source: 'seed' };

    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const parsed = generatedLessonSchema.parse(JSON.parse(cleaned));

    const updated: TopicLesson = {
      ...base,
      ...parsed,
    };
    generatedCache.set(id, updated);
    return { lesson: updated, source: 'local_llm' };
  } catch {
    return { lesson: base, source: 'seed' };
  }
}

export async function getBootstrapPayload(): Promise<{
  categories: BackendCategoryMeta[];
  questions: BackendQuestionFeed[];
  syncedAtIso: string;
}> {
  const categories = await getDynamicCategoriesFromDb();
  return {
    categories,
    questions: ALL_QUESTIONS_FEED,
    syncedAtIso: new Date().toISOString(),
  };
}
