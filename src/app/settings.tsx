import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, SegmentedButtons, Switch, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';
import { type ThemePreference, useThemeStore } from '@/store/useThemeStore';
import { spacing } from '@/theme/spacing';

export default function SettingsScreen() {
  const { theme } = useAppTheme();

  const preference = useThemeStore((s) => s.preference);
  const hapticsEnabled = useThemeStore((s) => s.hapticsEnabled);
  const setPreference = useThemeStore((s) => s.setPreference);
  const setHapticsEnabled = useThemeStore((s) => s.setHapticsEnabled);

  const dailyGoalTarget = useProgressStore((s) => s.dailyGoalTarget);
  const setDailyGoalTarget = useProgressStore((s) => s.setDailyGoalTarget);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <IconButton
          icon="arrow-left"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          accessibilityLabel="Go back"
        />
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
          Settings
        </Text>
      </View>

      <View style={styles.stack}>
        <LiquidCard variant="tonal">
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            {user ? `Signed in as ${user.name}` : 'Account & Cloud Activity Sync'}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}>
            {user
              ? user.email
              : 'Sign in to store every learning activity to your personal account.'}
          </Text>
          {user ? (
            <Button mode="outlined" onPress={logout}>
              Sign Out
            </Button>
          ) : (
            <Button mode="contained" onPress={() => router.push('/auth')}>
              Sign In / Create Account
            </Button>
          )}
        </LiquidCard>

        <LiquidCard>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            Appearance (Liquid Design)
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}>
            Choose Light, Dark, or follow your device system theme.
          </Text>
          <SegmentedButtons
            value={preference}
            onValueChange={(v) => setPreference(v as ThemePreference)}
            buttons={[
              { value: 'system', label: 'System' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </LiquidCard>

        <LiquidCard>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            Daily Study Goal
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}>
            Units per day (examples, Q&As, or topics) to maintain your streak.
          </Text>
          <View style={styles.chipsRow}>
            {[3, 5, 10, 15].map((goal) => (
              <Chip
                key={goal}
                selected={dailyGoalTarget === goal}
                onPress={() => setDailyGoalTarget(goal)}
              >
                {goal} / day
              </Chip>
            ))}
          </View>
        </LiquidCard>

        <LiquidCard>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                Haptic Feedback
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Subtle tactile feedback on completions and mock scores.
              </Text>
            </View>
            <Switch value={hapticsEnabled} onValueChange={setHapticsEnabled} />
          </View>
        </LiquidCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -spacing.sm,
    marginBottom: spacing.md,
  },
  stack: {
    gap: spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  switchLabel: {
    flex: 1,
    gap: 2,
  },
});
