---
name: content-authoring
description: >-
  Guides authoring of technical learning topics and interview Q&A banks for
  the Interview Preparation Mobile App. Enforces the 18-part Topic schema,
  10-field Q&A schema, conversational human-style interview answers, and the
  6-category Beginner-to-Advanced curriculum (JavaScript, React.js, Next.js,
  WordPress Development, Artificial Intelligence, TypeScript). Use whenever
  adding or editing learning content in src/content/ or types in
  src/types/content.ts.
---

# Content Authoring Skill

Content quality is the **highest priority** in this project. Every topic and question must help a candidate genuinely understand the concept and explain it confidently in a real interview.

## Core Writing Rules

1. **Human-Style Interview Answers**:
   - Write as if a senior/mid-level developer is speaking naturally in a live interview.
   - Avoid textbook jargon walls, overly academic phrasing, and robotic AI-style templates.
   - Provide **both** simple spoken interview answers (45–90s recallable) and detailed technical answers.
   - **Never sacrifice technical accuracy for simplicity.**
2. **No Shallow or Repetitive Content**:
   - Do **not** create shallow content or repeat the same questions with slightly different wording.
   - Cover Beginner, Intermediate, Advanced, and Senior-level scenario questions, plus follow-ups, practical exercises, and mini-projects.
3. **Curriculum Order**:
   - Focus on the **6 primary technologies**: JavaScript, React.js, Next.js, WordPress Development, Artificial Intelligence (AI), and TypeScript.
   - Start with **JavaScript** (Beginner → Intermediate → Advanced) and build a complete topic + Q&A bank before moving to the other 5 technologies.
4. **Code & Output Accuracy**:
   - Provide **at least 3 practical examples** per topic where applicable, each with valid, runnable code, exact `expectedOutput`, and an explanation.
   - Separate content files from UI (`src/content/<category>/<level>/<slug>.ts`).

## References

- **18-Part Topic Schema**: [topic-schema.md](./references/topic-schema.md)
- **10-Field Q&A Schema**: [qa-schema.md](./references/qa-schema.md)
- **6 Primary Technologies Curriculum**: [categories-curriculum.md](./references/categories-curriculum.md)
