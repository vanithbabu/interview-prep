import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, SegmentedButtons, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { LoadingState } from '@/components/ui/LoadingState';
import { getTopicById } from '@/content/topics';
import { ExampleRunner } from '@/features/topics/ExampleRunner';
import { TopicInterviewTab } from '@/features/topics/TopicInterviewTab';
import { TopicLessonCard } from '@/features/topics/TopicLessonCard';
import { TopicOverviewTab } from '@/features/topics/TopicOverviewTab';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  fetchTopicLesson,
  generateTopicExamplesBatchAI,
} from '@/services/contentApiService';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';
import { spacing } from '@/theme/spacing';
import type { TopicExample, TopicLesson } from '@/types/content';

type TopicTab = 'lesson' | 'examples' | 'overview' | 'interview';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topicId = id ?? '';
  const { theme } = useAppTheme();
  const hapticsEnabled = useThemeStore((s) => s.hapticsEnabled);
  const completedTopicIds = useProgressStore((s) => s.completedTopicIds);
  const toggleTopicCompleted = useProgressStore((s) => s.toggleTopicCompleted);

  const [tab, setTab] = useState<TopicTab>('lesson');
  const [lesson, setLesson] = useState<TopicLesson | null>(null);
  const [dynamicExamples, setDynamicExamples] = useState<TopicExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullTopic = getTopicById(topicId);

  const loadLesson = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTopicLesson(topicId);
      setLesson(data);
      if (!fullTopic) {
        const batch = await generateTopicExamplesBatchAI(topicId, 1);
        setDynamicExamples(batch.examples);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load topic');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      void loadLesson();
    }
  }, [topicId]);

  const handleSelectBatch = async (batchStart: 1 | 11 | 21 | 31 | 41) => {
    setLoadingBatch(true);
    setError(null);
    try {
      const res = await generateTopicExamplesBatchAI(topicId, batchStart);
      setDynamicExamples(res.examples);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load batch');
    } finally {
      setLoadingBatch(false);
    }
  };

  if (loading && !fullTopic) {
    return (
      <ScreenContainer scrollable={false}>
        <LoadingState message="Loading topic from backend..." />
      </ScreenContainer>
    );
  }

  if (!lesson && !fullTopic) {
    return (
      <ScreenContainer scrollable={false}>
        <EmptyState
          icon="book-clock-outline"
          title="Topic Not Found"
          description="Make sure the Express backend is running on port 4000."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  const displayTitle = lesson?.title ?? fullTopic?.title ?? '';
  const displayLevel = lesson?.level ?? fullTopic?.level ?? 'beginner';
  const displayMinutes = lesson?.estimatedMinutes ?? fullTopic?.estimatedMinutes ?? 30;
  const isTopicCompleted = completedTopicIds.includes(topicId);

  const handleToggleTopicComplete = async () => {
    if (hapticsEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    toggleTopicCompleted(topicId);
  };

  const tabButtons = fullTopic
    ? [
        { value: 'lesson', label: 'Quick Guide' },
        { value: 'examples', label: '50 Examples' },
        { value: 'overview', label: 'Deep Dive' },
        { value: 'interview', label: 'Q&A' },
      ]
    : [
        { value: 'lesson', label: 'Quick Guide' },
        { value: 'examples', label: '50 Examples' },
      ];

  const activeExamples = fullTopic ? fullTopic.examples : dynamicExamples;

  return (
    <ScreenContainer>
      <View style={styles.headerWrapper}>
        <View style={styles.navBar}>
          <IconButton
            icon="arrow-left"
            style={styles.backBtn}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
            accessibilityLabel="Go back"
          />
          <DifficultyBadge level={displayLevel} />
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            • ~{displayMinutes} min
          </Text>
        </View>

        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
          {displayTitle}
        </Text>

        <View style={styles.actionRow}>
          <Button
            mode={isTopicCompleted ? 'contained' : 'contained-tonal'}
            compact
            icon={isTopicCompleted ? 'check-circle' : 'check-circle-outline'}
            onPress={handleToggleTopicComplete}
          >
            {isTopicCompleted ? 'Topic Completed' : 'Mark Topic Complete'}
          </Button>
        </View>
      </View>

      {error ? <ErrorBanner message={error} onRetry={loadLesson} /> : null}

      {tabButtons.length > 1 ? (
        <SegmentedButtons
          value={tab}
          onValueChange={(value) => setTab(value as TopicTab)}
          style={styles.tabs}
          buttons={tabButtons}
        />
      ) : null}

      {tab === 'lesson' && lesson ? <TopicLessonCard lesson={lesson} /> : null}

      {tab === 'examples' && activeExamples.length > 0 ? (
        <ExampleRunner
          topicId={topicId}
          categoryId={lesson?.categoryId ?? fullTopic?.categoryId ?? 'javascript'}
          topicTitle={displayTitle}
          examples={activeExamples}
          totalTargetCount={50}
          loadingBatch={loadingBatch}
          onSelectGroup={fullTopic ? undefined : handleSelectBatch}
        />
      ) : null}

      {tab === 'overview' && fullTopic ? <TopicOverviewTab topic={fullTopic} /> : null}

      {tab === 'interview' && fullTopic ? <TopicInterviewTab topic={fullTopic} /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -spacing.sm,
    gap: spacing.xs,
  },
  backBtn: {
    margin: 0,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  tabs: {
    marginBottom: spacing.md,
  },
  lessonStack: {
    gap: spacing.md,
  },
});
