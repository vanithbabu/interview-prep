# Question & Answer Module Schema

Every standalone interview question in `src/content/` must include all 10 required fields:

```ts
export interface InterviewQuestion {
  id: string;
  categoryId: string;
  topicId?: string;
  title: string;                        // 1. Question title
  difficulty: DifficultyLevel;          // 2. Difficulty level
  shortAnswer: string;                  // 3. Short answer (1-2 sentences)
  detailedExplanation: string;          // 4. Detailed technical explanation
  humanInterviewAnswer: string;         // 5. Simple human-style interview answer
  practicalExample: string;             // 6. Practical real-world scenario
  codeExample?: {                       // 7 & 8. Code example + expected output
    language: string;
    code: string;
    expectedOutput: string;
  };
  followUpQuestions: string[];          // 9. Follow-up questions
  interviewerExpectations: string[];    // 10. Common interviewer expectations
  keyConcepts: string[];                // Used by Mock Interview evaluation rubric
  tags: string[];
}
```

## Tone & Quality Guide for `humanInterviewAnswer`

- **Bad (Robotic/Textbook)**:
  > "Closures in JavaScript are a fundamental lexical scoping mechanism whereby an inner function retains persistent references to the variable environment of its outer enclosing execution context."
- **Good (Human Developer)**:
  > "A closure happens when an inner function remembers variables from its outer function even after the outer function has finished running. I usually use closures for private state—like a counter or a debounced event handler—where I don't want outside code to mutate the variable directly."
