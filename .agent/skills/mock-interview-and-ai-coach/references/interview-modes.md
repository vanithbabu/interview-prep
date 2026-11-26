# Mock Interview Modes & Evaluation Rubric

## 9 Interview Modes

| Mode | Question Pool | Default Count | Time / Question |
| :--- | :--- | :--- | :--- |
| `beginner` | All 6 categories, `beginner` | 8 | 90s |
| `intermediate` | All 6 categories, `intermediate` | 10 | 120s |
| `advanced` | All 6 categories, `advanced` | 10 | 150s |
| `senior` | Senior-level scenarios across JS, React, Next.js, WordPress, AI, TS | 10 | 180s |
| `frontend` | JavaScript, TypeScript, React.js, Next.js | 10 | 120s |
| `react` | React.js, JavaScript, TypeScript | 10 | 120s |
| `nextjs` | Next.js, React.js, TypeScript, AI integration | 10 | 120s |
| `fullstack` | JavaScript, TypeScript, React.js, Next.js, WordPress, AI | 12 | 120s |
| `custom` | User-selected categories (from the 6), difficulty, and count | User | User |

## Local Evaluation Rubric (1–10 Scale)

When AI backend is unavailable or in offline Mock Interview mode, `evaluationService.ts` scores answers deterministically using `question.keyConcepts`:
- **Concept Coverage (0–7 pts)**: Percentage of `keyConcepts` addressed in the candidate's answer.
- **Clarity & Structure (0–3 pts)**: Answer length, presence of a practical example or trade-off explanation.
- **Missing Concepts**: List every `keyConcept` not detected in the response.
- **Improved Answer**: Display `question.humanInterviewAnswer` alongside missing concepts.
