# Recommended Feature-Based Folder Structure

```text
.
├── AGENTS.md
├── .agent/
│   └── skills/
│       ├── interview-app-architecture/
│       ├── content-authoring/
│       ├── mock-interview-and-ai-coach/
│       └── ui-ux-and-accessibility/
├── app/                              # Expo Router routes (thin screen wrappers only)
│   ├── _layout.tsx                   # Root layout: PaperProvider, theme, store hydration
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Bottom tab navigator
│   │   ├── index.tsx                 # Dashboard tab
│   │   ├── categories.tsx            # Technology categories tab
│   │   ├── search.tsx                # Search & bookmarks tab
│   │   ├── interview.tsx             # Mock interview & AI coach tab
│   │   └── progress.tsx              # Progress tracking tab
│   ├── category/[id].tsx             # Category detail (Beginner / Intermediate / Advanced)
│   ├── topic/[id].tsx                # 15-part Topic Learning screen
│   ├── question/[id].tsx             # Question & Answer detail screen
│   ├── mock-interview/
│   │   ├── setup.tsx                 # Mode & filter selection
│   │   ├── session.tsx               # Timed 1-question-at-a-time runner
│   │   └── summary.tsx               # Score, missing concepts & history
│   └── ai-coach/
│       └── session.tsx               # Interactive AI interviewer session
├── src/
│   ├── components/                   # Shared reusable UI components
│   │   ├── ui/                       # Cards, Badges, CodeBlock, EmptyState, LoadingState, ErrorBanner
│   │   └── layout/                   # ScreenContainer, SectionHeader
│   ├── features/                     # Feature modules (screens, local components, helpers)
│   │   ├── dashboard/
│   │   ├── categories/
│   │   ├── topics/
│   │   ├── questions/
│   │   ├── search/
│   │   ├── mock-interview/
│   │   ├── ai-coach/
│   │   └── progress/
│   ├── content/                      # Pure learning data (no React/UI imports)
│   │   ├── categories.ts             # Metadata for all 18 technologies
│   │   ├── javascript/               # Start here: beginner/, intermediate/, advanced/
│   │   └── ...                       # Other technology folders
│   ├── store/                        # Zustand stores with AsyncStorage persistence
│   │   ├── useProgressStore.ts       # Completed topics, answered Qs, streak, weak topics
│   │   ├── useBookmarksStore.ts      # Bookmarked questions & user notes
│   │   ├── useInterviewStore.ts      # Mock interview history & active session state
│   │   └── useThemeStore.ts          # Light / dark / system theme preference
│   ├── services/                     # Business logic & external integrations
│   │   ├── storage.ts                # Typed AsyncStorage adapter for Zustand
│   │   ├── streakService.ts          # Daily learning streak calculation
│   │   ├── searchService.ts          # Topic & question search/filtering
│   │   ├── evaluationService.ts      # Local heuristic & AI backend evaluation client
│   │   └── aiCoachService.ts         # Secure backend proxy client (no API keys in app)
│   ├── hooks/                        # Reusable custom hooks
│   │   ├── useAppTheme.ts
│   │   ├── useDebouncedValue.ts
│   │   └── useCountdownTimer.ts
│   ├── theme/                        # React Native Paper light & dark themes, typography, spacing
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   └── types/                        # Shared TypeScript interfaces
│       ├── content.ts
│       ├── interview.ts
│       ├── progress.ts
│       └── ai.ts
└── package.json
```
