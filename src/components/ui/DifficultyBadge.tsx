import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme/spacing';
import type { DifficultyLevel } from '@/types/content';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
}

const LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert / Senior',
  coding: 'Coding Prep',
};

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const { theme } = useAppTheme();

  const toneColor =
    level === 'beginner'
      ? theme.custom.success
      : level === 'intermediate'
        ? theme.custom.warning
        : level === 'coding'
          ? theme.colors.secondary
          : theme.colors.primary;

  return (
    <View
      style={[styles.pill, { backgroundColor: theme.colors.surfaceVariant }]}
      accessibilityLabel={`Difficulty: ${LABELS[level]}`}
    >
      <Text variant="labelSmall" style={[styles.text, { color: toneColor }]}>
        {LABELS[level]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
