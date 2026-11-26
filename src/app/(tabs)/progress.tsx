import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Chip, IconButton, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { DailyStreakCard } from '@/components/ui/DailyStreakCard';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { LiquidProgressBar } from '@/components/ui/LiquidProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAppTheme } from '@/hooks/useAppTheme';
import { computeProgressAnalytics } from '@/services/analyticsService';
import { getTodayDateKey } from '@/services/streakService';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookmarksStore } from '@/store/useBookmarksStore';
import { useContentStore } from '@/store/useContentStore';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useProgressStore } from '@/store/useProgressStore';
import { radius, spacing } from '@/theme/spacing';

export default function ProgressScreen() {
  const { theme } = useAppTheme();

  const completedTopicIds = useProgressStore((s) => s.completedTopicIds);
  const completedExampleIds = useProgressStore((s) => s.completedExampleIds);
  const answeredQuestionResults = useProgressStore((s) => s.answeredQuestionResults);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const longestStreak = useProgressStore((s) => s.longestStreak);
  const dailyGoalTarget = useProgressStore((s) => s.dailyGoalTarget);
  const todayActivityDate = useProgressStore((s) => s.todayActivityDate);
  const todayActivityCount = useProgressStore((s) => s.todayActivityCount);

  const bookmarkedQuestionIds = useBookmarksStore((s) => s.bookmarkedQuestionIds);
  const bookmarkedExampleIds = useBookmarksStore((s) => s.bookmarkedExampleIds);
  const mockHistory = useInterviewStore((s) => s.history);

  const todayCount =
    todayActivityDate === getTodayDateKey() ? todayActivityCount : 0;

  const categories = useContentStore((s) => s.categories);
  const questions = useContentStore((s) => s.questions);
  const activities = useAuthStore((s) => s.activities);

  const analytics = useMemo(
    () =>
      computeProgressAnalytics({
        categories,
        questions,
        completedTopicIds,
        completedExampleIds,
        answeredQuestionResults,
        currentStreak,
        longestStreak,
        mockHistory,
      }),
    [
      categories,
      questions,
      completedTopicIds,
      completedExampleIds,
      answeredQuestionResults,
      currentStreak,
      longestStreak,
      mockHistory,
    ]
  );

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
            Progress & Analytics
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Track consistency, weak topics, and interview readiness.
          </Text>
        </View>
        <IconButton
          icon="cog-outline"
          onPress={() => router.push('/settings')}
          accessibilityLabel="Open settings"
        />
      </View>

      <DailyStreakCard
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        todayCount={todayCount}
        dailyGoalTarget={dailyGoalTarget}
      />

      <View style={styles.statsGrid}>
        <LiquidCard style={styles.statCard}>
          <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '800' }}>
            {analytics.completedTopicsCount}/{analytics.totalTopics}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Topics Completed
          </Text>
        </LiquidCard>

        <LiquidCard style={styles.statCard}>
          <Text variant="headlineSmall" style={{ color: theme.colors.secondary, fontWeight: '800' }}>
            {analytics.completedExamplesCount}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Examples Done
          </Text>
        </LiquidCard>

        <LiquidCard style={styles.statCard}>
          <Text variant="headlineSmall" style={{ color: theme.custom.success, fontWeight: '800' }}>
            {analytics.correctCount}/{analytics.answeredCount}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Q&As Mastered
          </Text>
        </LiquidCard>

        <LiquidCard style={styles.statCard}>
          <Text variant="headlineSmall" style={{ color: theme.custom.warning, fontWeight: '800' }}>
            {bookmarkedQuestionIds.length + bookmarkedExampleIds.length}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Bookmarked Items
          </Text>
        </LiquidCard>
      </View>

      <SectionHeader title="Technology Mastery" />
      <LiquidCard>
        <View style={styles.catList}>
          {analytics.categoryProgress.map((cat) => (
            <View key={cat.id} style={styles.catRow}>
              <View style={styles.catLabelRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  {cat.name}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {cat.completed}/{cat.total}
                </Text>
              </View>
              <LiquidProgressBar
                progress={cat.ratio}
                color={cat.accentColor}
                height={6}
              />
            </View>
          ))}
        </View>
      </LiquidCard>

      <SectionHeader title="Weak Topics to Review" />
      {analytics.weakQuestions.length === 0 ? (
        <LiquidCard variant="tonal">
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            No weak questions flagged. Mark any tricky Q&A as “Needs Review” to focus on it here.
          </Text>
        </LiquidCard>
      ) : (
        <View style={styles.stack}>
          {analytics.weakQuestions.map((q) => (
            <Pressable key={q.id} onPress={() => router.push(`/question/${q.id}`)}>
              <LiquidCard>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                  {q.title}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.custom.warning, marginTop: 4 }}>
                  Tap to review
                </Text>
              </LiquidCard>
            </Pressable>
          ))}
        </View>
      )}

      <SectionHeader title="Mock Interview Average" />
      <LiquidCard variant="tonal">
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
          {analytics.averageMockScore !== null
            ? `${analytics.averageMockScore} / 10 across ${mockHistory.length} session(s)`
            : 'Complete a mock interview to track your score average.'}
        </Text>
      </LiquidCard>

      <SectionHeader title="Recent Activity Log" />
      {activities.length === 0 ? (
        <LiquidCard variant="tonal">
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Every completed example, topic, Q&A, and mock interview will be logged here.
          </Text>
        </LiquidCard>
      ) : (
        <View style={styles.stack}>
          {activities.slice(0, 10).map((act) => (
            <LiquidCard key={act.id}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {act.title}
              </Text>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                {act.actionType} • {new Date(act.createdAt).toLocaleString()}
              </Text>
            </LiquidCard>
          ))}
        </View>
      )}

      <SectionHeader title="Milestones" />
      <View style={styles.stack}>
        {analytics.milestones.map((m) => (
          <LiquidCard key={m.id} variant={m.earned ? 'surface' : 'tonal'}>
            <View style={styles.milestoneRow}>
              <MaterialCommunityIcons
                name={m.earned ? 'trophy' : 'trophy-outline'}
                size={24}
                color={m.earned ? theme.custom.warning : theme.colors.onSurfaceVariant}
              />
              <View style={styles.milestoneInfo}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                  {m.title}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {m.description}
                </Text>
              </View>
              <Chip compact>{m.earned ? 'Earned' : 'Locked'}</Chip>
            </View>
          </LiquidCard>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statCard: {
    width: '48.5%',
    gap: 2,
  },
  catList: {
    gap: spacing.md,
  },
  catRow: {
    gap: 6,
  },
  catLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bar: {
    height: 6,
    borderRadius: radius.pill,
  },
  stack: {
    gap: spacing.sm,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  milestoneInfo: {
    flex: 1,
    gap: 2,
  },
});
