import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInterviewStore } from '@/store/useInterviewStore';
import { spacing } from '@/theme/spacing';

export default function MockInterviewSummaryScreen() {
  const { theme } = useAppTheme();
  const record = useInterviewStore((s) => s.lastCompletedRecord);

  if (!record) {
    return (
      <ScreenContainer scrollable={false}>
        <EmptyState
          icon="clipboard-text-outline"
          title="No Completed Summary"
          description="Complete a mock interview to view your score breakdown."
          actionLabel="Back to Interview Hub"
          onAction={() => router.replace('/(tabs)/interview')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
        Interview Summary
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}>
        {record.modeTitle} • {record.evaluations.length} Questions
      </Text>

      <LiquidCard variant="tonal" style={styles.scoreCard}>
        <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          OVERALL SCORE
        </Text>
        <Text variant="displaySmall" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
          {record.averageScore} / 10
        </Text>
      </LiquidCard>

      <View style={styles.list}>
        {record.evaluations.map((ev, idx) => (
          <LiquidCard key={ev.questionId}>
            <View style={styles.qHeader}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', flex: 1 }}>
                {idx + 1}. {ev.questionTitle}
              </Text>
              <Chip compact>{ev.score}/10</Chip>
            </View>
            {ev.missingConcepts.length > 0 ? (
              <Text variant="bodySmall" style={{ color: theme.custom.warning, marginTop: spacing.xs }}>
                Missed: {ev.missingConcepts.join(', ')}
              </Text>
            ) : (
              <Text variant="bodySmall" style={{ color: theme.custom.success, marginTop: spacing.xs }}>
                All key concepts covered!
              </Text>
            )}
          </LiquidCard>
        ))}
      </View>

      <View style={styles.actions}>
        <Button mode="contained" onPress={() => router.replace('/(tabs)/interview')}>
          Done
        </Button>
        <Button mode="outlined" onPress={() => router.replace('/mock-interview/setup')}>
          Practice Again
        </Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  list: {
    gap: spacing.sm,
  },
  qHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
