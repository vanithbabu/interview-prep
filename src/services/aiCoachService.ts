import { z } from 'zod';

import { getApiBaseUrl } from '@/services/apiBaseUrl';
import type { AICoachTurnRequest, AICoachTurnResponse } from '@/types/ai';

const coachResponseSchema = z.object({
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

const AI_PROXY_URL = getApiBaseUrl();

export async function submitAICoachTurn(
  payload: AICoachTurnRequest
): Promise<AICoachTurnResponse> {
  const response = await fetch(`${AI_PROXY_URL}/api/v1/interview/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AI Coach server error (${response.status})`);
  }

  const raw: unknown = await response.json();
  return coachResponseSchema.parse(raw);
}
