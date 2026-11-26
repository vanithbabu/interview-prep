import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Text, TextInput } from 'react-native-paper';

import { CodeBlock } from '@/components/ui/CodeBlock';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { LiquidProgressBar } from '@/components/ui/LiquidProgressBar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { runSandboxedJavaScript } from '@/services/codeRunnerService';
import { useBookmarksStore } from '@/store/useBookmarksStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';
import { radius, spacing } from '@/theme/spacing';
import type { TechnologyId, TopicExample } from '@/types/content';

interface ExampleRunnerProps {
  topicId: string;
  categoryId: TechnologyId;
  topicTitle: string;
  examples: TopicExample[];
  totalTargetCount?: number;
  loadingBatch?: boolean;
  onSelectGroup?: (batchStart: 1 | 11 | 21 | 31 | 41) => Promise<void>;
}

const GROUPS: Array<{ label: string; start: number; batchStart: 1 | 11 | 21 | 31 | 41 }> = [
  { label: '1–10', start: 0, batchStart: 1 },
  { label: '11–20', start: 10, batchStart: 11 },
  { label: '21–30', start: 20, batchStart: 21 },
  { label: '31–40', start: 30, batchStart: 31 },
  { label: '41–50', start: 40, batchStart: 41 },
];

export function ExampleRunner({
  topicId,
  categoryId,
  topicTitle,
  examples,
  totalTargetCount = 50,
  loadingBatch = false,
  onSelectGroup,
}: ExampleRunnerProps) {
  const { theme } = useAppTheme();
  const hapticsEnabled = useThemeStore((s) => s.hapticsEnabled);

  const completedExampleIds = useProgressStore((s) => s.completedExampleIds);
  const lastExampleByTopic = useProgressStore((s) => s.lastExampleByTopic);
  const toggleExampleCompleted = useProgressStore((s) => s.toggleExampleCompleted);
  const setLastExampleForTopic = useProgressStore((s) => s.setLastExampleForTopic);
  const setLastViewedTopic = useProgressStore((s) => s.setLastViewedTopic);

  const bookmarkedExampleIds = useBookmarksStore((s) => s.bookmarkedExampleIds);
  const toggleBookmarkExample = useBookmarksStore((s) => s.toggleBookmarkExample);

  const initialIndex = Math.max(
    0,
    Math.min(examples.length - 1, (lastExampleByTopic[topicId] ?? 1) - 1)
  );
  const [index, setIndex] = useState(initialIndex);
  const [showAnswer, setShowAnswer] = useState(true);
  const [tryMode, setTryMode] = useState(false);
  const [scratchCode, setScratchCode] = useState(examples[initialIndex]?.code ?? '');
  const [scratchOutput, setScratchOutput] = useState<string | null>(null);

  const current = examples[index];

  useEffect(() => {
    if (!current) return;
    setLastExampleForTopic(topicId, current.number);
    setLastViewedTopic({
      topicId,
      categoryId,
      title: topicTitle,
      exampleNumber: current.number,
    });
    setScratchCode(current.code);
    setScratchOutput(null);
  }, [index, current, topicId, categoryId, topicTitle, setLastExampleForTopic, setLastViewedTopic]);

  if (!current) return null;

  const completedInTopic = examples.filter((ex) =>
    completedExampleIds.includes(ex.id)
  ).length;
  const totalCount = Math.max(examples.length, totalTargetCount);
  const completionRatio = totalCount > 0 ? completedInTopic / totalCount : 0;
  const isCompleted = completedExampleIds.includes(current.id);
  const isBookmarked = bookmarkedExampleIds.includes(current.id);

  const handleToggleComplete = async () => {
    if (hapticsEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleExampleCompleted(current.id);
  };

  const handleToggleBookmark = async () => {
    if (hapticsEnabled) {
      await Haptics.selectionAsync();
    }
    toggleBookmarkExample(current.id);
  };

  const handleRunScratch = () => {
    const res = runSandboxedJavaScript(scratchCode);
    setScratchOutput(res.error ? `Error: ${res.error}` : res.output);
  };

  return (
    <View style={styles.container}>
      <LiquidCard variant="tonal">
        <View style={styles.progressRow}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            {completedInTopic} / {totalCount} Examples Completed
          </Text>
          <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            {Math.round(completionRatio * 100)}%
          </Text>
        </View>
        <View style={styles.barWrap}>
          <LiquidProgressBar progress={completionRatio} trackColor={theme.colors.surface} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupRow}>
          {GROUPS.map((g) => {
            const active =
              current.number >= g.batchStart && current.number <= g.batchStart + 9;
            return (
              <Chip
                key={g.label}
                selected={active}
                disabled={loadingBatch}
                onPress={async () => {
                  const foundIdx = examples.findIndex((e) => e.number === g.batchStart);
                  if (foundIdx >= 0) {
                    setIndex(foundIdx);
                    return;
                  }
                  if (onSelectGroup) {
                    await onSelectGroup(g.batchStart);
                    setIndex(0);
                  }
                }}
                compact
                style={{ marginRight: spacing.xs }}
              >
                {g.label}
              </Chip>
            );
          })}
        </ScrollView>
      </LiquidCard>

      <LiquidCard>
        <View style={styles.exampleHeader}>
          <View style={styles.exampleTitleBlock}>
            <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {current.groupTitle}
            </Text>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
              #{current.number}. {current.title}
            </Text>
          </View>
          <IconButton
            icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            iconColor={isBookmarked ? theme.colors.primary : theme.colors.onSurfaceVariant}
            onPress={handleToggleBookmark}
            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark example'}
          />
        </View>

        <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.secondary }]}>
          Concept
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          {current.concept}
        </Text>

        <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.secondary }]}>
          Syntax
        </Text>
        <Text variant="bodySmall" style={[styles.syntaxText, { color: theme.colors.onSurfaceVariant, backgroundColor: theme.colors.surfaceVariant }]}>
          {current.syntax}
        </Text>

        <View style={styles.codeHeader}>
          <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.secondary }]}>
            Code
          </Text>
          <View style={styles.miniControls}>
            <Button mode="text" compact onPress={() => setShowAnswer((v) => !v)}>
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </Button>
            <Button mode="text" compact onPress={() => setTryMode((v) => !v)}>
              {tryMode ? 'Close Editor' : 'Try It Yourself'}
            </Button>
          </View>
        </View>

        {tryMode ? (
          <View style={styles.tryBox}>
            <TextInput
              mode="outlined"
              multiline
              value={scratchCode}
              onChangeText={setScratchCode}
              style={styles.editorInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.tryActions}>
              <Button mode="text" compact onPress={() => setScratchCode(current.code)}>
                Reset
              </Button>
              <Button mode="contained-tonal" compact icon="play" onPress={handleRunScratch}>
                Run My Code
              </Button>
            </View>
            {scratchOutput !== null ? (
              <Text variant="bodySmall" style={[styles.syntaxText, { color: theme.colors.onSurface, backgroundColor: theme.colors.secondaryContainer }]}>
                {scratchOutput}
              </Text>
            ) : null}
          </View>
        ) : (
          <CodeBlock
            key={current.id}
            code={current.code}
            expectedOutput={current.expectedOutput}
            showOutput={showAnswer}
          />
        )}

        {showAnswer ? (
          <View style={styles.detailsStack}>
            <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.secondary }]}>
              Step-by-Step Explanation
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {current.explanation}
            </Text>

            <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.secondary }]}>
              Real-World Usage
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {current.realWorldUsage}
            </Text>

            <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.primary }]}>
              Interview Tip
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              “{current.interviewTip}”
            </Text>
          </View>
        ) : null}

        <View style={styles.navRow}>
          <Button
            mode="outlined"
            icon="chevron-left"
            disabled={index === 0}
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Previous
          </Button>

          <Button
            mode={isCompleted ? 'contained' : 'contained-tonal'}
            icon={isCompleted ? 'check-circle' : 'check'}
            onPress={handleToggleComplete}
          >
            {isCompleted ? 'Completed' : 'Mark Done'}
          </Button>

          <Button
            mode="outlined"
            contentStyle={{ flexDirection: 'row-reverse' }}
            icon="chevron-right"
            disabled={index >= examples.length - 1}
            onPress={() => setIndex((i) => Math.min(examples.length - 1, i + 1))}
          >
            Next
          </Button>
        </View>
      </LiquidCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  barWrap: {
    marginBottom: spacing.md,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exampleTitleBlock: {
    flex: 1,
    gap: 2,
  },
  sectionLabel: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  syntaxText: {
    fontFamily: 'monospace',
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  miniControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tryBox: {
    gap: spacing.sm,
  },
  editorInput: {
    fontFamily: 'monospace',
    fontSize: 13,
    minHeight: 110,
  },
  tryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  detailsStack: {
    marginTop: spacing.xs,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
});
