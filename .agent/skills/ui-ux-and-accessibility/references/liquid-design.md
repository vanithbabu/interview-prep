# Liquid Design Principles for React Native

Liquid Design makes the interface feel fluid, lightweight, and naturally responsive across phone and tablet viewports in both Light and Dark themes.

## 1. Fluid & Adaptive Geometry
- **No Rigid Pixel Containers**: Use `flex: 1`, percentage/grid proportions, and a centered `maxWidth: 720` reading container on wide/tablet screens.
- **Responsive Tokens**: Derive spacing (`xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`) and breakpoints (`useWindowDimensions`) from `src/theme/spacing.ts` so padding scales naturally.
- **Continuous Curves**: Prefer generous, consistent corner radii (`sm: 10`, `md: 16`, `lg: 24`, `pill: 999`) for cards, chips, code blocks, and bottom sheets.

## 2. Layered & Translucent Surfaces
- **Soft Depth Over Heavy Borders**: Separate content using subtle tonal surface steps (`background` → `surface` → `surfaceVariant`) and soft elevation rather than harsh `1px` grid lines.
- **Translucent Chrome**: Use subtle translucent headers, floating action bars, and glassmorphic overlays (e.g., `expo-blur` or semi-transparent `theme.colors.surface` with `rgba` alpha) where appropriate without hurting text legibility.

## 3. Organic Motion & Micro-Interactions
- **Spring Physics**: Prefer gentle spring animations (`damping: 18, stiffness: 180` or `Animated.spring`) for card presses, accordion expansions, progress bar fills, and bottom sheet transitions.
- **State Continuity**: Transition smoothly between Loading → Content → Empty/Error states instead of abrupt layout jumps.
- **Reduced Motion**: Always respect `AccessibilityInfo.isReduceMotionEnabled()` and fall back to instant or subtle opacity fades when enabled.

## 4. Breathing Room & Visual Calm
- **Uncluttered Hierarchy**: One primary action per card; limit each screen section to scannable chunks (e.g., segmented tabs or collapsible cards for the 18-part Topic Learning Module).
- **Safe Area Integration**: Always wrap screens with `SafeAreaView` / `useSafeAreaInsets` so fluid backgrounds extend edge-to-edge while interactive controls stay comfortably reachable.
