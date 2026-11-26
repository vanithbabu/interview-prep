import { useColorScheme } from 'react-native';

import { useThemeStore } from '@/store/useThemeStore';
import { type AppTheme, darkTheme, getNavigationTheme, lightTheme } from '@/theme';

export function useAppTheme(): {
  theme: AppTheme;
  navigationTheme: ReturnType<typeof getNavigationTheme>;
  isDark: boolean;
} {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((state) => state.preference);

  const isDark =
    preference === 'dark' || (preference === 'system' && systemScheme === 'dark');

  return {
    theme: isDark ? darkTheme : lightTheme,
    navigationTheme: getNavigationTheme(isDark),
    isDark,
  };
}
