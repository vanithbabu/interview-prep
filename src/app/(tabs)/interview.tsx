import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInterviewStore } from '@/store/useInterviewStore';
import { spacing } from '@/theme/spacing';

export default function InterviewScreen() {
  const { theme } = useAppTheme();
  const history = useInterviewStore((s) => s.history);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
          Interview Practice
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Timed mock interviews with 1–10 scoring and missing-concept feedback.
        </Text>
      </View>

      <View style={styles.stack}>
        <LiquidCard variant="tonal">
          <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            MOCK INTERVIEW ENGINE
          </Text>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '800', marginTop: spacing.xs }}>
            9 Specialized Interview Modes
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}>
            Practice Beginner to Senior Developer, Frontend, React, Next.js, Full Stack, or Custom interviews one question at a time.
          </Text>
          <Button
            mode="contained"
            icon="play-circle-outline"
            style={styles.primaryBtn}
            onPress={() => router.push('/mock-interview/setup')}
          >
            Start Mock Interview
          </Button>
        </LiquidCard>

        <LiquidCard>
          <View style={styles.aiHeader}>
            <Text variant="labelLarge" style={{ color: theme.colors.secondary, fontWeight: '700' }}>
              AI INTERVIEW COACH
            </Text>
            <Chip compact>Express.js Proxy</Chip>
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: spacing.xs }}>
            Interactive Follow-Ups & Evaluation
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}>
            One question at a time with dynamic follow-ups and a final performance report.
          </Text>
          <Button
            mode="contained-tonal"
            icon="robot-outline"
            style={styles.primaryBtn}
            onPress={() => router.push('/ai-coach/session')}
          >
            Start AI Coach
          </Button>
        </LiquidCard>
      </View>

      <SectionHeader title="Saved Interview History" />

      {history.length === 0 ? (
        <LiquidCard variant="tonal">
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            No completed mock interviews yet. Start your first session above!
          </Text>
        </LiquidCard>
      ) : (
        <View style={styles.stack}>
          {history.slice(0, 10).map((record) => (
            <LiquidCard key={record.id}>
              <View style={styles.historyRow}>
                <View style={styles.historyInfo}>
                  <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                    {record.modeTitle}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {record.evaluations.length} questions • {new Date(record.createdAtIso).toLocaleDateString()}
                  </Text>
                </View>
                <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '800' }}>
                  {record.averageScore}/10
                </Text>
              </View>
            </LiquidCard>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  stack: {
    gap: spacing.md,
  },
  primaryBtn: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
});
