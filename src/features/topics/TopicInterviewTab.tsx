import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, Text } from 'react-native-paper';

import { CodeBlock } from '@/components/ui/CodeBlock';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing } from '@/theme/spacing';
import type { TopicDetail } from '@/types/content';

interface TopicInterviewTabProps {
  topic: TopicDetail;
}

export function TopicInterviewTab({ topic }: TopicInterviewTabProps) {
  const { theme } = useAppTheme();
  const [expandedSolution, setExpandedSolution] = useState<Record<string, boolean>>({});

  return (
    <View style={styles.stack}>
      <Text variant="titleMedium" style={{ color: theme.colors.onBackground, fontWeight: '700' }}>
        Interview Questions & Answers
      </Text>

      {topic.interviewQuestions.map((q) => (
        <LiquidCard key={q.id}>
          <Chip compact style={styles.chip}>
            {q.level.toUpperCase()}
          </Chip>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: spacing.xs }}>
            {q.question}
          </Text>

          <Text variant="labelLarge" style={[styles.subLabel, { color: theme.colors.primary }]}>
            Simple Spoken Answer
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            “{q.spokenAnswer}”
          </Text>

          <Text variant="labelLarge" style={[styles.subLabel, { color: theme.colors.secondary }]}>
            Detailed Technical Answer
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {q.detailedAnswer}
          </Text>

          {q.followUps.map((f, idx) => (
            <View key={idx} style={styles.followUp}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                Follow-up: {f.question}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                {f.answer}
              </Text>
            </View>
          ))}
        </LiquidCard>
      ))}

      <Text variant="titleMedium" style={{ color: theme.colors.onBackground, fontWeight: '700', marginTop: spacing.md }}>
        Practical Exercises
      </Text>

      {topic.practicalExercises.map((ex) => {
        const open = Boolean(expandedSolution[ex.id]);
        return (
          <LiquidCard key={ex.id} variant="tonal">
            <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              {ex.title}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: spacing.xs }}>
              {ex.prompt}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}>
              Hint: {ex.hint}
            </Text>
            <Button
              mode="text"
              compact
              style={styles.solButton}
              onPress={() =>
                setExpandedSolution((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))
              }
            >
              {open ? 'Hide Solution' : 'Show Solution'}
            </Button>
            {open ? (
              <CodeBlock
                code={ex.solutionCode}
                expectedOutput={ex.expectedOutput}
                showOutput
              />
            ) : null}
          </LiquidCard>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  subLabel: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  followUp: {
    marginTop: spacing.sm,
    paddingLeft: spacing.sm,
  },
  solButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
});
