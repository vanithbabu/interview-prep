---
name: mock-interview-and-ai-coach
description: >-
  Guides implementation of the Mock Interview Engine (9 modes, timer, 1-10
  scoring, missing concepts, history) and the AI Interview Coach (interactive
  1-question-at-a-time flow, follow-ups, technical evaluation, and secure
  backend proxy). Use when building Phase 6 or Phase 8 interview features.
---

# Mock Interview & AI Coach Skill

## Mock Interview Engine (Phase 6)

1. **9 Supported Modes**: Beginner, Intermediate, Advanced, Senior Developer, Frontend Developer, React Developer, Next.js Developer, Full Stack Developer, Custom Interview.
2. **Session Flow**:
   - Select mode (and categories/difficulty/question count for Custom).
   - Present **one question at a time** with a countdown timer (`useCountdownTimer`).
   - Support text input and an optional voice-input adapter interface (`SpeechInputAdapter`).
   - On submit: show the expected `humanInterviewAnswer`, score **1–10**, list missing `keyConcepts`, and provide an improved answer.
   - Persist completed sessions to AsyncStorage via `useInterviewStore`.

## AI Interview Coach (Phase 8)

1. **Security Rule (Strict)**:
   - **NEVER** store or expose AI provider API keys (`OPENAI_API_KEY`, `GEMINI_API_KEY`, etc.) in the Expo/React Native client or `.env` bundled into `EXPO_PUBLIC_*`.
   - All AI requests MUST go through a secure backend endpoint (e.g., Supabase Edge Function, Firebase Cloud Function, or Express/Next.js API proxy) defined via `EXPO_PUBLIC_AI_PROXY_URL`.
2. **Interactive Coach Flow**:
   - Ask **one question at a time** tailored to target role/level.
   - Wait for candidate response.
   - Evaluate technical correctness, check missing points, explain mistakes, and suggest a better answer.
   - Ask relevant follow-up questions before advancing.
   - Generate a final performance report (overall score, strengths, weak areas, study recommendations).

## References

- **Interview Modes & Rubric**: [interview-modes.md](./references/interview-modes.md)
- **AI Coach Backend Protocol**: [ai-coach-protocol.md](./references/ai-coach-protocol.md)
