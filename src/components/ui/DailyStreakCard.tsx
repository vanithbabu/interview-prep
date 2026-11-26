import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { LiquidCard } from '@/components/ui/LiquidCard';
import { LiquidProgressBar } from '@/components/ui/LiquidProgressBar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing } from '@/theme/spacing';

interface DailyStreakCardProps {
  currentStreak: number;
  longestStreak: number;
  todayCount: number;
  dailyGoalTarget: number;
}

export function DailyStreakCard({
  currentStreak,
  longestStreak,
  todayCount,
  dailyGoalTarget,
}: DailyStreakCardProps) {
  const { theme } = useAppTheme();
  const progress = Math.min(1, todayCount / Math.max(1, dailyGoalTarget));
  const goalMet = todayCount >= dailyGoalTarget;

  return (
    <LiquidCard variant="tonal">
      <View style={styles.topRow}>
        <View style={styles.streakBadge}>
          <MaterialCommunityIcons
            name="fire"
            size={28}
            color={currentStreak > 0 ? theme.custom.warning : theme.colors.onSurfaceVariant}
          />
          <View>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
              {currentStreak} Day{currentStreak === 1 ? '' : 's'}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Best: {longestStreak} day{longestStreak === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        <View style={styles.goalCounter}>
          <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            {todayCount}/{dailyGoalTarget}
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Today&apos;s Goal
          </Text>
        </View>
      </View>

      <View style={styles.barWrap}>
        <LiquidProgressBar
          progress={progress}
          color={goalMet ? theme.custom.success : theme.colors.primary}
          trackColor={theme.colors.surface}
        />
      </View>

      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {goalMet
          ? 'Daily goal complete! Great consistency today.'
          : `Complete ${dailyGoalTarget - todayCount} more unit${dailyGoalTarget - todayCount === 1 ? '' : 's'} to keep your streak alive.`}
      </Text>
    </LiquidCard>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  goalCounter: {
    alignItems: 'flex-end',
  },
  barWrap: {
    marginBottom: spacing.sm,
  },
});
