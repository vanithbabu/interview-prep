# AGENTS.md – Interview Preparation Mobile App

## MANDATORY WORKFLOW RULE: PLAN FIRST (DO NOT EXECUTE IMMEDIATELY)

- **Whenever the user gives a task, DO NOT write, edit, or execute code immediately.**
- First, present a clear **Implementation Plan** covering:
  1. Files to create or modify.
  2. Architecture, state, security, and Liquid Design decisions.
  3. Verification and testing steps.
- **Stop and wait for explicit user approval** before making any changes.

## Project Overview

Build a complete React Native Interview Preparation Application using Expo, TypeScript and Expo Router.

The application works as a personal technical interview learning platform for developers preparing for junior, mid-level and senior software engineering interviews.

The main objective is to teach every technical concept from beginner to advanced level with:
- Simple human-readable explanations.
- Real-world examples.
- Multiple code examples.
- Interview questions and answers.
- Practical scenarios.
- Follow-up questions.
- Mock interview practice.

## Technology Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Zustand
- React Native Paper
- AsyncStorage
- Firebase or Supabase (optional backend integration)
- AI API integration via a secure backend proxy for dynamic interview evaluation

## Main Modules

1. **Dashboard**: Welcome section, overall learning progress, total completed topics, daily learning streak, continue learning, recommended interview questions, recent mock interview scores, quick access to all technologies.
2. **Technology Categories**: Focus on 6 primary technologies — **JavaScript**, **React.js**, **Next.js**, **WordPress Development**, **Artificial Intelligence (AI)**, and **TypeScript** — each with a complete Beginner-to-Advanced learning roadmap.
3. **Topic Learning Module**: 18-part structure per topic (introduction, simple human-language explanation, why it is needed, how it works internally, syntax, at least 3 practical examples, code output & explanation, real-world developer use cases, common mistakes, beginner/intermediate/advanced interview questions, senior-level scenario questions, simple spoken interview answers, detailed technical answers, follow-up questions & answers, practical exercises, and mini-projects).
4. **Question and Answer Module**: Title, difficulty, short answer, detailed explanation, simple human-style interview answer, practical example, code example + expected output, follow-up questions, common interviewer expectations.
5. **Mock Interview Module**: 9 modes (Beginner, Intermediate, Advanced, Senior Developer, Frontend Developer, React Developer, Next.js Developer, Full Stack Developer, Custom Interview) with random questions, timer, 1–10 scoring, missing concepts, improved answers, and saved history.
6. **AI Interview Coach**: One question at a time, waits for answer, asks follow-ups, evaluates technical correctness, checks missing points, explains mistakes, suggests better answers, provides final performance report. **Never expose API keys in the mobile app; always route AI requests through a secure backend.**
7. **Progress Tracking**: Topics completed, questions answered, correct/incorrect counts, bookmarked questions, weak topics, mock interview scores, learning streak, overall progress.
8. **Search and Bookmarks**: Search topics and questions, filter by difficulty, bookmark questions, save notes, review difficult questions, filter unanswered questions.

## Architecture, Security & Code Standards

- Use **feature-based architecture** (`src/features/<feature>/`).
- Keep UI components reusable and free of business logic.
- Use strict TypeScript (`strict: true`, no `any`, explicit return types on services/hooks).
- Use Zustand for application state and AsyncStorage for local persistence (use `expo-secure-store` for any sensitive tokens, never AsyncStorage).
- **Security**: Never expose API keys or secrets in the mobile bundle (`EXPO_PUBLIC_*` is public); validate and sanitize all user/API inputs; enforce HTTPS and backend rate-limiting/auth for AI Coach requests.
- **Liquid Design**: Build fluid, adaptive layouts with smooth spring/easing transitions, responsive spacing/typography, subtle translucent elevation, and uncluttered hierarchy across screen sizes and Light/Dark themes.
- Keep learning content separate from UI (`src/content/`).
- Create reusable hooks (`src/hooks/`) and services (`src/services/`).
- **Content Quality is the highest priority**: Answers must sound like a real developer explaining a concept in an interview—simple, memorable, conversational, and technically accurate. Start with JavaScript (Beginner → Advanced) before moving to other technologies.

## Incremental Development Plan

Build incrementally across 9 phases—never put everything in a single screen or file. After completing each phase, explain the files created, functionality implemented, and how to test the features:

- **Phase 1**: Project setup and navigation.
- **Phase 2**: Dashboard and technology categories.
- **Phase 3**: Topic-wise learning.
- **Phase 4**: Question and answer bank.
- **Phase 5**: Search and bookmarks.
- **Phase 6**: Mock interview engine.
- **Phase 7**: Progress tracking.
- **Phase 8**: AI interviewer integration.
- **Phase 9**: Testing and optimization.

## Workspace Skills

Use the specialized skills in `.agent/skills/` when working on specific parts of the app:
- `interview-app-architecture`: Folder structure, phase-by-phase setup, Zustand/AsyncStorage patterns.
- `content-authoring`: Topic & Q&A TypeScript schemas (18-part topic format), human-style writing rules, and the 6-category Beginner-to-Advanced curriculum.
- `mock-interview-and-ai-coach`: Mock interview engine, scoring rubric, and secure AI backend proxy.
- `ui-ux-and-accessibility`: React Native Paper theming, Liquid Design principles, navigation, responsive layouts, states, and a11y.
- `security-and-code-standards`: Mobile/API security, secret protection, safe storage, strict TypeScript, and clean code standards.
