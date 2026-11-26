# 18-Part Topic Learning Module Schema

Every topic in `src/content/` must implement the 18-part structure:

```ts
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  expectedOutput: string;
  outputExplanation: string;
}

export interface TopicQuestionItem {
  question: string;
  spokenAnswer: string;         // 14. Simple spoken interview answer
  detailedAnswer: string;       // 15. Detailed technical answer
  followUps: Array<{            // 16. Follow-up questions and answers
    question: string;
    answer: string;
  }>;
}

export interface PracticeExercise {
  title: string;
  prompt: string;
  hint?: string;
  solutionCode?: string;
  expectedOutput?: string;
}

export interface MiniProject {
  title: string;
  goal: string;
  requirements: string[];
  starterHint?: string;
}

export interface Topic {
  id: string;
  categoryId: 'javascript' | 'react' | 'nextjs' | 'wordpress' | 'ai' | 'typescript';
  slug: string;
  title: string;
  level: DifficultyLevel;
  estimatedMinutes: number;

  // 1–9 Core Concept & Code Sections
  introduction: string;               // 1. Topic introduction
  simpleExplanation: string;          // 2. Simple human-language explanation
  whyNeeded: string;                  // 3. Why it is needed
  howItWorksInternally: string;       // 4. How it works internally
  syntax: string;                     // 5. Syntax (code/pattern reference)
  practicalExamples: CodeExample[];   // 6 & 7. At least 3 practical examples + code output & explanation
  realWorldUseCases: string[];        // 8. Real-world developer use cases
  commonMistakes: string[];           // 9. Common mistakes

  // 10–16 Tiered Interview Questions & Answers
  beginnerQuestions: TopicQuestionItem[];     // 10. Beginner interview questions (+ 14, 15, 16)
  intermediateQuestions: TopicQuestionItem[]; // 11. Intermediate interview questions (+ 14, 15, 16)
  advancedQuestions: TopicQuestionItem[];     // 12. Advanced interview questions (+ 14, 15, 16)
  seniorScenarioQuestions: TopicQuestionItem[]; // 13. Senior-level scenario questions where relevant

  // 17–18 Hands-on Practice
  practiceExercises: PracticeExercise[]; // 17. Practical exercises
  miniProjects: MiniProject[];           // 18. Mini-projects
}
```

## Authoring Checklist
- At least **3 practical `practicalExamples`** per topic where applicable, each with exact `expectedOutput` and `outputExplanation`.
- Distinct, non-repetitive questions across Beginner, Intermediate, Advanced, and Senior-level tiers.
- Every question includes both a concise `spokenAnswer` (natural conversational tone) and a thorough `detailedAnswer`, plus `followUps`.
