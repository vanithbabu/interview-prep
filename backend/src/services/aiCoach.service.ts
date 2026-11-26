import { env } from '../config/env.js';
import {
  findKnowledgeForTurn,
  INTERVIEW_KNOWLEDGE_BASE,
} from '../data/interviewKnowledge.js';
import {
  coachTurnResponseSchema,
  type CoachTurnRequest,
  type CoachTurnResponse,
} from '../schemas/aiCoach.schema.js';

function stripJsonFences(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function buildFallbackEvaluation(req: CoachTurnRequest): CoachTurnResponse {
  const normalized = req.candidateAnswer.trim().toLowerCase();
  const matchedItem = INTERVIEW_KNOWLEDGE_BASE.find(
    (item) => item.question.toLowerCase() === req.currentQuestion.toLowerCase()
  );

  const keyConcepts = matchedItem?.keyConcepts ?? [
    'core definition',
    'real-world example',
    'trade-offs',
  ];
  const matchedConcepts = keyConcepts.filter((c) =>
    c
      .toLowerCase()
      .split(/\s+/)
      .some((token) => token.length > 2 && normalized.includes(token))
  );
  const missingConcepts = keyConcepts.filter((c) => !matchedConcepts.includes(c));

  const words = normalized.split(/\s+/).filter(Boolean).length;
  const conceptRatio = keyConcepts.length > 0 ? matchedConcepts.length / keyConcepts.length : 0.5;
  const score = Math.max(
    1,
    Math.min(10, Math.round(conceptRatio * 7) + (words >= 25 ? 3 : words >= 12 ? 2 : 1))
  );

  const isFinal = req.questionIndex >= 3;
  const askedQuestions = [req.currentQuestion, ...req.history.map((h) => h.question)];
  const nextCandidates = findKnowledgeForTurn({
    categoryId: req.categoryId,
    level: req.level,
    askedQuestions,
  });
  const nextKnowledge = nextCandidates[0];

  const avgScore =
    req.history.length > 0
      ? Math.round(
          ((req.history.reduce((s, h) => s + h.score, 0) + score) /
            (req.history.length + 1)) *
            10
        ) / 10
      : score;

  const useFollowUp = !isFinal && req.questionIndex % 2 === 0 && Boolean(matchedItem?.followUp);

  return {
    evaluation: {
      score,
      isTechnicallyAccurate: score >= 6,
      strengths:
        matchedConcepts.length > 0
          ? matchedConcepts.map((c) => `Addressed ${c}`)
          : ['Provided a starting explanation'],
      missingConcepts,
      mistakesExplained:
        score < 6
          ? matchedItem?.commonMistakes ?? [
              'Include concrete examples and trade-offs to strengthen your answer.',
            ]
          : [],
      betterAnswer:
        matchedItem?.referenceAnswer ??
        'Start with a 1-sentence core definition, explain how it works internally, give a real project example, and finish with one trade-off.',
    },
    nextAction: isFinal ? 'final_report' : useFollowUp ? 'follow_up' : 'next_question',
    nextPrompt: isFinal
      ? undefined
      : useFollowUp
        ? matchedItem?.followUp
        : nextKnowledge?.question ??
          `Describe a challenging ${req.role} (${req.level}) bug you solved and how you prevented it.`,
    finalReport: isFinal
      ? {
          overallScore: avgScore,
          readinessLevel: avgScore >= 7.5 ? 'Interview Ready' : 'Developing — Keep Practicing',
          topStrengths: ['Structured communication', 'Curriculum concept awareness'],
          weakTopics: missingConcepts.length > 0 ? missingConcepts : ['Edge cases & trade-offs'],
          actionPlan: [
            'Practice speaking answers aloud in 60–90 seconds.',
            'Include one real-world example and one trade-off in every answer.',
          ],
        }
      : undefined,
  };
}

export async function evaluateCoachTurn(req: CoachTurnRequest): Promise<CoachTurnResponse> {
  if (env.AI_PROVIDER === 'fallback') {
    return buildFallbackEvaluation(req);
  }
  if (env.AI_PROVIDER === 'openai' && !env.AI_API_KEY) {
    return buildFallbackEvaluation(req);
  }

  const isLocal = env.AI_PROVIDER === 'local';
  const baseUrl = isLocal ? env.LOCAL_AI_URL : env.AI_BASE_URL;
  const model = isLocal ? env.LOCAL_AI_MODEL : env.AI_MODEL;

  const matchedItem = INTERVIEW_KNOWLEDGE_BASE.find(
    (item) => item.question.toLowerCase() === req.currentQuestion.toLowerCase()
  );
  const askedQuestions = [req.currentQuestion, ...req.history.map((h) => h.question)];
  const curriculumFeed = findKnowledgeForTurn({
    categoryId: req.categoryId,
    level: req.level,
    askedQuestions,
  }).slice(0, 4);

  const systemPrompt = `You are a supportive, technically rigorous senior software engineering interviewer conducting a ${req.level} ${req.role} interview (focus: ${req.categoryId}).

CURRICULUM RUBRIC FOR CURRENT QUESTION:
${
  matchedItem
    ? `- Key concepts to verify: ${matchedItem.keyConcepts.join(', ')}
- Common mistakes to catch: ${matchedItem.commonMistakes.join('; ')}
- Human-style benchmark answer: ${matchedItem.referenceAnswer}`
    : '- Verify technical accuracy, practical examples, and trade-offs.'
}

UPCOMING CURRICULUM QUESTIONS (pick one if nextAction is "next_question", never repeat asked questions):
${curriculumFeed.map((item) => `- [${item.categoryId}/${item.level}] ${item.question}`).join('\n')}

Respond ONLY with valid JSON matching this schema:
{
  "evaluation": {
    "score": number (1-10),
    "isTechnicallyAccurate": boolean,
    "strengths": string[],
    "missingConcepts": string[],
    "mistakesExplained": string[],
    "betterAnswer": string (natural human-style developer answer)
  },
  "nextAction": "follow_up" | "next_question" | "final_report",
  "nextPrompt": string (required unless final_report),
  "finalReport": { "overallScore": number, "readinessLevel": string, "topStrengths": string[], "weakTopics": string[], "actionPlan": string[] } (only when final_report)
}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (!isLocal && env.AI_API_KEY) {
    headers.Authorization = `Bearer ${env.AI_API_KEY}`;
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: JSON.stringify({
              questionIndex: req.questionIndex,
              currentQuestion: req.currentQuestion,
              candidateAnswer: req.candidateAnswer,
              previousTurns: req.history,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI provider returned status ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawContent = payload.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('Empty AI provider response');
    }

    const parsedJson: unknown = JSON.parse(stripJsonFences(rawContent));
    return coachTurnResponseSchema.parse(parsedJson);
  } catch (err) {
    console.warn(
      '[AI Coach] Falling back to curriculum evaluator:',
      err instanceof Error ? err.message : 'Unavailable'
    );
    return buildFallbackEvaluation(req);
  }
}
