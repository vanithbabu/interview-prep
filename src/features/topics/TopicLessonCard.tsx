import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';

import { CodeBlock } from '@/components/ui/CodeBlock';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme/spacing';
import type { TopicLesson } from '@/types/content';

interface TopicLessonCardProps {
  lesson: TopicLesson;
}

function NumberedHeading({
  number,
  title,
  accent,
  bg,
}: {
  number: string;
  title: string;
  accent: string;
  bg: string;
}) {
  return (
    <View style={styles.sectionHeadingRow}>
      <View style={[styles.numPill, { backgroundColor: bg }]}>
        <Text variant="labelSmall" style={{ color: accent, fontWeight: '800' }}>
          {number}
        </Text>
      </View>
      <Text variant="titleSmall" style={{ color: accent, fontWeight: '800' }}>
        {title}
      </Text>
    </View>
  );
}

export function TopicLessonCard({ lesson }: TopicLessonCardProps) {
  const { theme } = useAppTheme();
  const [expandedByIdx, setExpandedByIdx] = useState<Record<number, boolean>>({});

  const toggleAnswer = (idx: number) => {
    setExpandedByIdx((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <LiquidCard accentColor={theme.colors.primary} style={styles.card}>
      <View style={styles.headerRow}>
        <Text
          variant="titleLarge"
          style={{ color: theme.colors.onSurface, fontWeight: '800', flex: 1 }}
        >
          {lesson.categoryName} – {lesson.title}
        </Text>
        <DifficultyBadge level={lesson.level} />
      </View>

      <Surface
        elevation={0}
        style={[styles.questionBox, { backgroundColor: theme.colors.surfaceVariant }]}
      >
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, lineHeight: 22 }}>
          <Text style={{ fontWeight: '800', color: theme.colors.primary }}>Question: </Text>
          {lesson.coreQuestion}
        </Text>
      </Surface>

      <NumberedHeading
        number="1"
        title="Simple human answer"
        accent={theme.colors.onSurface}
        bg={theme.colors.primaryContainer}
      />
      <Text variant="bodyMedium" style={[styles.bodyText, { color: theme.colors.onSurfaceVariant }]}>
        {lesson.simpleHumanAnswer}
      </Text>

      <NumberedHeading
        number="2"
        title="Real-world example"
        accent={theme.colors.onSurface}
        bg={theme.colors.primaryContainer}
      />
      <Text variant="bodyMedium" style={[styles.bodyText, { color: theme.colors.onSurfaceVariant }]}>
        {lesson.realWorldExample}
      </Text>

      <NumberedHeading
        number="3"
        title="Code examples"
        accent={theme.colors.onSurface}
        bg={theme.colors.primaryContainer}
      />
      <View style={styles.examplesStack}>
        {lesson.codeExamples.map((ex, idx) => (
          <View key={idx} style={styles.exampleItem}>
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.primary, fontWeight: '700', marginBottom: 4 }}
            >
              {ex.title}
            </Text>
            <CodeBlock
              code={ex.code}
              language={ex.language}
              expectedOutput={ex.expectedOutput}
              showOutput
            />
          </View>
        ))}
      </View>

      <NumberedHeading
        number="4"
        title="Interview speaking answer"
        accent={theme.colors.onSurface}
        bg={theme.colors.secondaryContainer}
      />
      <Surface
        elevation={0}
        style={[styles.quoteBox, { backgroundColor: theme.colors.surfaceVariant }]}
      >
        <Text variant="bodyMedium" style={[styles.bodyText, { color: theme.colors.onSurface }]}>
          “{lesson.interviewSpeakingAnswer}”
        </Text>
      </Surface>

      <NumberedHeading
        number="5"
        title="Follow-up questions"
        accent={theme.colors.onSurface}
        bg={theme.colors.primaryContainer}
      />
      <View style={styles.followUpList}>
        {lesson.followUpQuestions.map((fq, idx) => {
          const answer = lesson.followUpAnswers?.[idx]?.answer;
          const isExpanded = Boolean(expandedByIdx[idx]);

          return (
            <Surface
              key={idx}
              elevation={0}
              style={[
                styles.followUpCard,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.outline,
                },
              ]}
            >
              <Text
                variant="bodyMedium"
                style={[styles.bullet, { color: theme.colors.onSurface, fontWeight: '600' }]}
              >
                {idx + 1}. {fq}
              </Text>

              {answer ? (
                <>
                  <View style={styles.followUpActions}>
                    <Button
                      mode="text"
                      compact
                      icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                      onPress={() => toggleAnswer(idx)}
                    >
                      {isExpanded ? 'Hide Answer' : 'Show Answer'}
                    </Button>
                  </View>

                  {isExpanded ? (
                    <View
                      style={[
                        styles.aiAnswerBox,
                        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
                      ]}
                    >
                      <Text
                        variant="labelSmall"
                        style={{ color: theme.colors.primary, fontWeight: '700', marginBottom: 4 }}
                      >
                        ANSWER
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurface, lineHeight: 20 }}>
                        {answer}
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : null}
            </Surface>
          );
        })}
      </View>
    </LiquidCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  questionBox: {
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  numPill: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyText: {
    lineHeight: 23,
  },
  examplesStack: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  exampleItem: {
    gap: 4,
  },
  quoteBox: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  followUpList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  followUpCard: {
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  followUpActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  aiAnswerBox: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  bullet: {
    lineHeight: 22,
  },
});
