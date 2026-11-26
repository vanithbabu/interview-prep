import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { ProgressBarCard } from '@/components/ui/ProgressBarCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useContentStore } from '@/store/useContentStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';
import { spacing } from '@/theme/spacing';
import type { DifficultyLevel, TechnologyId, TopicSummary } from '@/types/content';

const LEVELS: Array<{ key: DifficultyLevel; short: string; label: string }> = [
  { key: 'beginner', short: 'Beginner', label: 'Level 1 – Beginner (Foundation)' },
  { key: 'intermediate', short: 'Intermediate', label: 'Level 2 – Intermediate (Practical)' },
  { key: 'advanced', short: 'Advanced', label: 'Level 3 – Advanced' },
  { key: 'expert', short: 'Expert', label: 'Level 4 – Expert & Senior Developer' },
  { key: 'coding', short: 'Coding', label: 'Level 5 – Coding Interview Prep' },
];

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();
  const hapticsEnabled = useThemeStore((s) => s.hapticsEnabled);
  const completedTopicIds = useProgressStore((s) => s.completedTopicIds);
  const toggleTopicCompleted = useProgressStore((s) => s.toggleTopicCompleted);
  const categories = useContentStore((s) => s.categories);

  const [selectedLevel, setSelectedLevel] = useState<'all' | DifficultyLevel>('beginner');

  const category = categories.find((c) => c.id === ((id ?? '') as TechnologyId));

  if (!category) {
    return (
      <ScreenContainer scrollable={false}>
        <EmptyState
          icon="alert-circle-outline"
          title="Technology Not Found"
          description="This technology category does not exist."
          actionLabel="Go Back"
          onAction={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
        />
      </ScreenContainer>
    );
  }

  const completedCount = category.topics.filter((t) =>
    completedTopicIds.includes(t.id)
  ).length;
  const progress = category.topics.length > 0 ? completedCount / category.topics.length : 0;

  const handleToggle = async (topic: TopicSummary) => {
    if (hapticsEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleTopicCompleted(topic.id);
  };

  const visibleLevels =
    selectedLevel === 'all' ? LEVELS : LEVELS.filter((l) => l.key === selectedLevel);

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <IconButton
          icon="arrow-left"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          accessibilityLabel="Back to categories"
        />
        <View style={styles.titleBlock}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
            {category.name}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {category.shortDescription}
          </Text>
        </View>
      </View>

      <View style={styles.progressWrap}>
        <ProgressBarCard
          title={`${category.name} Roadmap`}
          subtitle={`${completedCount} of ${category.topics.length} modules completed`}
          progress={progress}
          accentColor={category.accentColor}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <Chip
          selected={selectedLevel === 'all'}
          onPress={() => setSelectedLevel('all')}
          compact
        >
          All ({category.topics.length})
        </Chip>
        {LEVELS.map((lvl) => {
          const count = category.topics.filter((t) => t.level === lvl.key).length;
          if (count === 0) return null;
          return (
            <Chip
              key={lvl.key}
              selected={selectedLevel === lvl.key}
              onPress={() => setSelectedLevel(lvl.key)}
              compact
            >
              {lvl.short} ({count})
            </Chip>
          );
        })}
      </ScrollView>

      {visibleLevels.map(({ key, label }) => {
        const topicsInLevel = category.topics.filter((t) => t.level === key);
        if (topicsInLevel.length === 0) return null;

        return (
          <View key={key}>
            <SectionHeader title={label} />
            <View style={styles.topicList}>
              {topicsInLevel.map((topic) => {
                const isDone = completedTopicIds.includes(topic.id);
                return (
                  <LiquidCard
                    key={topic.id}
                    accentColor={isDone ? theme.custom.success : undefined}
                  >
                    <View style={styles.topicHeader}>
                      <DifficultyBadge level={topic.level} />
                      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {topic.exampleCount} examples • ~{topic.estimatedMinutes} min
                      </Text>
                    </View>

                    <Text
                      variant="titleMedium"
                      style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: spacing.sm }}
                    >
                      {topic.title}
                    </Text>

                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}
                    >
                      {topic.description}
                    </Text>

                    <View style={styles.actions}>
                      <Button
                        mode={isDone ? 'outlined' : 'contained-tonal'}
                        compact
                        icon={isDone ? 'check-circle' : 'circle-outline'}
                        onPress={() => handleToggle(topic)}
                      >
                        {isDone ? 'Completed' : 'Mark Complete'}
                      </Button>
                      <Button
                        mode="contained"
                        compact
                        icon="book-open-page-variant-outline"
                        onPress={() => router.push(`/topic/${topic.id}`)}
                      >
                        Open Topic
                      </Button>
                    </View>
                  </LiquidCard>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginLeft: -spacing.sm,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  progressWrap: {
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  topicList: {
    gap: spacing.md,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
