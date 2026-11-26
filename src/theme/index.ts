import { DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme } from 'expo-router';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { darkColors, lightColors } from './colors';
import { radius } from './spacing';

export interface AppTheme extends MD3Theme {
  custom: {
    success: string;
    warning: string;
    glassSurface: string;
  };
}

export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  roundness: radius.md,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.primary,
    onPrimary: lightColors.onPrimary,
    primaryContainer: lightColors.primaryContainer,
    onPrimaryContainer: lightColors.onPrimaryContainer,
    secondary: lightColors.secondary,
    onSecondary: lightColors.onSecondary,
    secondaryContainer: lightColors.secondaryContainer,
    onSecondaryContainer: lightColors.onSecondaryContainer,
    background: lightColors.background,
    surface: lightColors.surface,
    surfaceVariant: lightColors.surfaceVariant,
    onBackground: lightColors.onBackground,
    onSurface: lightColors.onSurface,
    onSurfaceVariant: lightColors.onSurfaceVariant,
    outline: lightColors.outline,
    error: lightColors.error,
    onError: lightColors.onError,
    errorContainer: lightColors.errorContainer,
    onErrorContainer: lightColors.onErrorContainer,
  },
  custom: {
    success: lightColors.success,
    warning: lightColors.warning,
    glassSurface: lightColors.glassSurface,
  },
};

export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  roundness: radius.md,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary,
    onPrimary: darkColors.onPrimary,
    primaryContainer: darkColors.primaryContainer,
    onPrimaryContainer: darkColors.onPrimaryContainer,
    secondary: darkColors.secondary,
    onSecondary: darkColors.onSecondary,
    secondaryContainer: darkColors.secondaryContainer,
    onSecondaryContainer: darkColors.onSecondaryContainer,
    background: darkColors.background,
    surface: darkColors.surface,
    surfaceVariant: darkColors.surfaceVariant,
    onBackground: darkColors.onBackground,
    onSurface: darkColors.onSurface,
    onSurfaceVariant: darkColors.onSurfaceVariant,
    outline: darkColors.outline,
    error: darkColors.error,
    onError: darkColors.onError,
    errorContainer: darkColors.errorContainer,
    onErrorContainer: darkColors.onErrorContainer,
  },
  custom: {
    success: darkColors.success,
    warning: darkColors.warning,
    glassSurface: darkColors.glassSurface,
  },
};

export function getNavigationTheme(isDark: boolean) {
  const base = isDark ? NavDarkTheme : NavLightTheme;
  const appTheme = isDark ? darkTheme : lightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: appTheme.colors.primary,
      background: appTheme.colors.background,
      card: appTheme.colors.surface,
      text: appTheme.colors.onSurface,
      border: appTheme.colors.outline,
      notification: appTheme.colors.error,
    },
  };
}
