# Incremental Development Phases (1–9)

## Phase 1: Project Setup and Navigation
- Initialize Expo + TypeScript + Expo Router project.
- Install `react-native-paper`, `react-native-safe-area-context`, `zustand`, `@react-native-async-storage/async-storage`, `@expo/vector-icons`.
- Set up `src/theme/` (Light & Dark Paper themes, spacing, typography).
- Configure `app/_layout.tsx` and `app/(tabs)/_layout.tsx` with 5 bottom tabs (Dashboard, Categories, Search, Interview, Progress).
- Add placeholder screens and reusable `ScreenContainer`, `LoadingState`, `EmptyState`.

## Phase 2: Dashboard and Technology Categories
- Define all 18 technology categories in `src/content/categories.ts`.
- Build Dashboard screen: welcome header, overall progress, completed topics count, daily streak, continue learning card, recommended questions, recent mock scores, technology quick-access grid.
- Build Categories list and `app/category/[id].tsx` grouped by Beginner, Intermediate, and Advanced.

## Phase 3: Topic-Wise Learning
- Define `Topic` TypeScript interfaces in `src/types/content.ts`.
- Author comprehensive JavaScript Beginner → Intermediate → Advanced topics first.
- Build `app/topic/[id].tsx` rendering all 15 required topic sections cleanly with collapsible/tabbed sections and a `CodeBlock` component showing expected output.
- Wire "Mark as Completed" to `useProgressStore`.

## Phase 4: Question and Answer Bank
- Define `InterviewQuestion` TypeScript interfaces.
- Build comprehensive JavaScript Q&A bank (Beginner → Advanced) before expanding to other technologies.
- Build `app/question/[id].tsx` displaying short answer, human-style interview answer, detailed explanation, practical & code examples, expected output, follow-up questions, and interviewer expectations.
- Allow marking answers as understood/correct or needs-review.

## Phase 5: Search and Bookmarks
- Implement `searchService.ts` for searching topics & questions.
- Add filters: difficulty (Beginner/Intermediate/Advanced), technology, unanswered only, bookmarked, difficult/weak.
- Build `useBookmarksStore.ts` for bookmarking questions and saving personal notes per question.

## Phase 6: Mock Interview Engine
- Implement all 9 interview modes in `mock-interview/setup.tsx`.
- Build timed, one-question-at-a-time runner (`mock-interview/session.tsx`) supporting text answers (and optional voice input hook/adapter).
- Evaluate answers (1–10 score, missing concepts, improved answer) and display expected answer after submission.
- Persist interview history in `useInterviewStore`.

## Phase 7: Progress Tracking
- Implement `streakService.ts` and `useProgressStore.ts` metrics: topics completed, questions answered, correct/incorrect ratio, bookmarked count, weak topics detection, mock score trend, overall progress.
- Build `app/(tabs)/progress.tsx` with clean visual summaries.

## Phase 8: AI Interviewer Integration
- Build `aiCoachService.ts` calling a secure backend endpoint (Firebase Functions / Supabase Edge Functions / Node proxy) — **never** embed API keys in the Expo app.
- Implement interactive AI Interview Coach session: 1 question at a time, wait for answer, dynamic follow-ups, technical evaluation, missing points, better answer suggestions, and final performance report.

## Phase 9: Testing and Optimization
- Add unit tests for stores (`useProgressStore`, `useBookmarksStore`, `useInterviewStore`) and services (`streakService`, `searchService`, `evaluationService`).
- Optimize list rendering (`FlatList` / `FlashList` keys, memoized cards), lazy-load heavy content modules, verify Light/Dark mode contrast, and test offline AsyncStorage persistence.
