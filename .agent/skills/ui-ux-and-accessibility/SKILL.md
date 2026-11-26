---
name: ui-ux-and-accessibility
description: >-
  Guides UI/UX design, Liquid Design principles, React Native Paper Light/Dark
  theming, bottom tab navigation, responsive layouts, reusable components,
  loading/empty/error states, and accessibility controls. Use when creating or
  styling screens and components under app/ or src/components/.
---

# UI/UX, Liquid Design & Accessibility Skill

Build a clean, modern, uncluttered mobile interface using **React Native Paper**, **Expo Router**, and **Liquid Design Principles**.

## Liquid Design Principles

1. **Fluid & Adaptive Layouts**:
   - Never rely on rigid fixed-pixel widths/heights for containers; use flex proportions, `maxWidth` reading containers on tablets/landscape, and responsive breakpoints (`useWindowDimensions`).
   - Respect device safe areas (`SafeAreaView` / `useSafeAreaInsets`) seamlessly across notches, dynamic islands, and gesture bars.
2. **Translucent & Layered Surfaces**:
   - Use soft, layered surface elevation (`surface`, `surfaceVariant`, subtle translucent overlays/headers where supported) and generous rounded corners (`borderRadius` tokens) so cards feel light and cohesive rather than boxy.
3. **Smooth Micro-Interactions**:
   - Animate state transitions smoothly (progress bars, collapsible sections, card presses, tab transitions, mock interview timer feedback) using fluid spring/timing curves (`react-native-reanimated` or `Animated`) while respecting reduced-motion preferences.
4. **Dynamic Rhythm & Hierarchy**:
   - Scale spacing and typography harmoniously using `src/theme/spacing.ts` and MD3 type scales so content breathes without feeling overcrowded.

> For concrete tokens, surface layering, spring curves, and responsive layout patterns, see [liquid-design.md](./references/liquid-design.md).

## Core Design Standards

1. **Uncluttered Screens**:
   - Break dense content (like the 18-part Topic Learning Module) into scannable cards, segmented tabs, or expandable accordions rather than one giant wall of text.
2. **Theming (Light & Dark)**:
   - Define `lightTheme` and `darkTheme` in `src/theme/index.ts` extending `MD3LightTheme` and `MD3DarkTheme`.
   - Persist user preference (`light` | `dark` | `system`) in `useThemeStore`.
   - Never hardcode `#000000` or `#FFFFFF`; always read from `theme.colors`.
3. **Required UI States**:
   - Every list/detail/async screen must handle **Loading** (`LoadingState`), **Empty** (`EmptyState`), and **Error** (`ErrorBanner` with retry) states cleanly.
4. **Reusable Components (`src/components/ui/`)**:
   - `CodeBlock`: Monospace container with horizontal scroll, copy-to-clipboard button, and an "Expected Output" + explanation sub-panel.
   - `DifficultyBadge`: Color-coded chip for `Beginner`, `Intermediate`, `Advanced`.
   - `ProgressBarCard`: Reusable progress indicator with percentage and subtitle.
5. **Accessibility (a11y)**:
   - Provide `accessibilityLabel` and `accessibilityRole` on all icon buttons, tabs, bookmark toggles, and interactive cards.
   - Maintain WCAG AA contrast ratios in both Light and Dark themes.
   - Support minimum 44x44pt touch targets.
