import { z } from 'zod';

export const coachTurnRequestSchema = z.object({
  sessionId: z.string().min(3).max(120),
  categoryId: z
    .enum(['all', 'javascript', 'react', 'nextjs', 'wordpress', 'php', 'laravel', 'mysql', 'ai', 'typescript'])
    .optional()
    .default('all'),
  role: z.string().min(2).max(80),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'senior']),
  questionIndex: z.number().int().min(0).max(20),
  currentQuestion: z.string().min(5).max(1000),
  candidateAnswer: z.string().min(1).max(4000),
  history: z
    .array(
      z.object({
        question: z.string().max(1000),
        answer: z.string().max(4000),
        score: z.number().min(1).max(10),
      })
    )
    .max(20)
    .default([]),
});

export const coachTurnResponseSchema = z.object({
  evaluation: z.object({
    score: z.number().min(1).max(10),
    isTechnicallyAccurate: z.boolean(),
    strengths: z.array(z.string()),
    missingConcepts: z.array(z.string()),
    mistakesExplained: z.array(z.string()),
    betterAnswer: z.string(),
  }),
  nextAction: z.enum(['follow_up', 'next_question', 'final_report']),
  nextPrompt: z.string().optional(),
  finalReport: z
    .object({
      overallScore: z.number().min(1).max(10),
      readinessLevel: z.string(),
      topStrengths: z.array(z.string()),
      weakTopics: z.array(z.string()),
      actionPlan: z.array(z.string()),
    })
    .optional(),
});

export type CoachTurnRequest = z.infer<typeof coachTurnRequestSchema>;
export type CoachTurnResponse = z.infer<typeof coachTurnResponseSchema>;
