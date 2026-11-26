# AI Interview Coach Backend Protocol

## Security Boundary

- The mobile app sends `{ sessionId, role, level, history, candidateAnswer }` to `POST ${AI_PROXY_URL}/interview/evaluate`.
- The backend holds the LLM API key, validates/rate-limits requests, and returns structured JSON.

## Expected JSON Response Contract

```ts
export interface AICoachTurnResponse {
  evaluation: {
    score: number;              // 1 to 10
    isTechnicallyAccurate: boolean;
    strengths: string[];
    missingConcepts: string[];
    mistakesExplained: string[];
    betterAnswer: string;       // Human-style improved answer
  };
  nextAction: 'follow_up' | 'next_question' | 'final_report';
  nextPrompt?: string;          // Follow-up or next interview question
  finalReport?: {
    overallScore: number;
    readinessLevel: string;
    topStrengths: string[];
    weakTopics: string[];
    actionPlan: string[];
  };
}
```

## Error & Offline Handling
- Show a clear `ErrorBanner` with retry if the backend is unreachable.
- Never crash the session; allow falling back to local mock evaluation if the user chooses.
