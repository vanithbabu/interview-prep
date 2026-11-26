---
name: interview-app-architecture
description: >-
  Guides the feature-based architecture, Expo + Expo Router + TypeScript setup,
  Zustand + AsyncStorage state persistence, and 9-phase incremental build for
  the Interview Preparation Mobile App. Use when initializing the project,
  scaffolding folders, adding stores/services/hooks, or starting a new phase.
---

# Interview App Architecture

Follow a clean, feature-based architecture using Expo, TypeScript, Expo Router, Zustand, React Native Paper, and AsyncStorage.

## Core Principles

1. **Feature-Based Structure**: Group domain logic, screens, and feature-specific components under `src/features/<feature>/`.
2. **Separation of Concerns**:
   - `app/` contains only Expo Router route files (thin wrappers that render feature screens).
   - `src/content/` stores static learning data (topics, questions, categories) completely separate from UI.
   - `src/store/` manages global state with Zustand + AsyncStorage persistence.
   - `src/services/` handles storage, scoring, streak calculation, and secure backend API calls.
   - `src/hooks/` provides reusable hooks for screens without embedding logic in JSX.
3. **Incremental Delivery**: Build one phase at a time. Never dump multiple modules into a single file or screen.

## References

- **Directory Layout**: See [folder-structure.md](./references/folder-structure.md) for the exact folder tree and file placement rules.
- **Phase Roadmap**: See [development-phases.md](./references/development-phases.md) for deliverables and verification steps for Phases 1–9.

## Phase Completion Checklist

After completing any phase:
1. Verify TypeScript compiles cleanly (`npx tsc --noEmit`).
2. Verify Expo bundles without errors (`npx expo start`).
3. Summarize:
   - **Files created/modified**
   - **Functionality implemented**
   - **How to test the features** (exact steps on simulator/device/web).
