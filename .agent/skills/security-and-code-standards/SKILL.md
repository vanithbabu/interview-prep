---
name: security-and-code-standards
description: >-
  Enforces mobile security best practices, secret/API key protection, input
  validation, safe local storage, strict TypeScript, and clean code standards
  across the Interview Preparation Mobile App. Use when writing services,
  stores, backend proxies, forms, or reviewing code quality.
---

# Security & Code Standards Skill

## Security Standards

1. **Zero Secrets in Client Bundle**:
   - Never hardcode API keys, tokens, or credentials in source files.
   - Treat all `EXPO_PUBLIC_*` environment variables as **publicly readable** in the compiled app binary.
   - Route all AI Coach and sensitive backend calls through a secure server-side proxy (`AI_PROXY_URL`) where API keys live in server secrets.
2. **Safe Storage**:
   - Use `AsyncStorage` only for non-sensitive learning progress, bookmarks, notes, and theme preferences.
   - Use `expo-secure-store` for any authentication tokens, session secrets, or sensitive user credentials.
3. **Input Validation & Sanitization**:
   - Validate all user inputs (search queries, notes, custom interview forms, AI coach answers) with length bounds and type checks before persisting or sending to a backend.
   - Validate and parse all API responses (e.g., with Zod or strict runtime type guards) before updating Zustand state; never trust unvalidated JSON.
4. **Network & Error Hygiene**:
   - Enforce `https://` for all remote endpoints (except local dev).
   - Never expose raw stack traces, internal URLs, or server error payloads in UI alerts—show user-friendly messages via `ErrorBanner`.

## Code Standards

1. **Strict TypeScript**:
   - Enable `"strict": true` in `tsconfig.json`.
   - Avoid `any`; use `unknown` + type narrowing or explicit generics.
   - Define explicit interfaces for component props, store states/actions, and service responses.
2. **Clean Architecture & Modularity**:
   - Keep functions small, single-purpose, and shallowly nested with early returns.
   - No business logic or direct `AsyncStorage`/`fetch` calls inside UI components—delegate to `src/services/` and `src/hooks/`.
   - Eliminate duplicated logic by extracting shared helpers or reusable UI components.
3. **Consistency & Verification**:
   - Use consistent naming: `PascalCase` for components/types, `camelCase` for hooks (`use*`), services (`*Service`), and utilities.
   - Run `npx tsc --noEmit` and lint checks after every phase before reporting completion.
