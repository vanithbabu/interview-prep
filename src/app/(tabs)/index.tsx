import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { DailyStreakCard } from '@/components/ui/DailyStreakCard';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { ProgressBarCard } from '@/components/ui/ProgressBarCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getDailyQuickWin, getDailyTip } from '@/content/motivation';
import { CategoryCard } from '@/features/categories/CategoryCard';
import { QuickWinCard } from '@/features/dashboard/QuickWinCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getTodayDateKey } from '@/services/streakService';
import { useAuthStore } from '@/store/useAuthStore';
import { useContentStore } from '@/store/useContentStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';
import { spacing } from '@/theme/spacing';

export default function DashboardScreen() {
  const { theme, isDark } = useAppTheme();
  const setPreference = useThemeStore((s) => s.setPreference);
  const user = useAuthStore((s) => s.user);

  const completedTopicIds = useProgressStore((s) => s.completedTopicIds);
  const lastViewedTopic = useProgressStore((s) => s.lastViewedTopic);
  const dailyGoalTarget = useProgressStore((s) => s.dailyGoalTarget);
  const todayActivityDate = useProgressStore((s) => s.todayActivityDate);
  const todayActivityCount = useProgressStore((s) => s.todayActivityCount);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const longestStreak = useProgressStore((s) => s.longestStreak);
  const recentMockScores = useProgressStore((s) => s.recentMockScores);
  const recordActivity = useProgressStore((s) => s.recordActivity);

  const categories = useContentStore((s) => s.categories);
  const questions = useContentStore((s) => s.questions);
  const todayKey = getTodayDateKey();
  const todayCount = todayActivityDate === todayKey ? todayActivityCount : 0;
  const allTopics = categories.flatMap((c) => c.topics);
  const overallProgress =
    allTopics.length > 0 ? completedTopicIds.length / allTopics.length : 0;

  const dailyTip = getDailyTip(todayKey);
  const quickWin = getDailyQuickWin(todayKey);
  const recommendedQuestions = questions.slice(0, 3);

  return (
    <ScreenContainer>
      <View style={styles.headerWrapper}>
        <View style={styles.topBar}>
          <View style={styles.titleBlock}>
            <Text variant="labelSmall" style={{ color: theme.colors.secondary, fontWeight: '700', letterSpacing: 0.8 }}>
              INTERVIEW PREP
            </Text>
            <Text
              variant="headlineSmall"
              numberOfLines={1}
              style={{ color: theme.colors.onBackground, fontWeight: '800' }}
            >
              {user ? `Hi, ${user.name}` : 'Welcome Back'}
            </Text>
          </View>

          <View
            style={[
              styles.topActionsPill,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
            ]}
          >
            <IconButton
              icon={user ? 'account-check' : 'account-circle-outline'}
              size={19}
              style={styles.headerIconBtn}
              iconColor={user ? theme.colors.primary : theme.colors.onSurfaceVariant}
              onPress={() => router.push('/auth')}
              accessibilityLabel={user ? 'Account profile' : 'Sign in'}
            />
            <IconButton
              icon={isDark ? 'weather-sunny' : 'weather-night'}
              size={19}
              style={styles.headerIconBtn}
              iconColor={theme.colors.onSurfaceVariant}
              onPress={() => setPreference(isDark ? 'light' : 'dark')}
              accessibilityLabel="Toggle light or dark theme"
            />
            <IconButton
              icon="cog-outline"
              size={19}
              style={styles.headerIconBtn}
              iconColor={theme.colors.onSurfaceVariant}
              onPress={() => router.push('/settings')}
              accessibilityLabel="Open settings"
            />
          </View>
        </View>

        <View
          style={[
            styles.tipBanner,
            { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline },
          ]}
        >
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={16}
            color={theme.colors.secondary}
            style={styles.tipIcon}
          />
          <Text variant="bodySmall" style={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}>
            {dailyTip}
          </Text>
        </View>
      </View>

      <View style={styles.stack}>
        <DailyStreakCard
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          todayCount={todayCount}
          dailyGoalTarget={dailyGoalTarget}
        />

        <ProgressBarCard
          title="Overall Learning Progress"
          subtitle={`${completedTopicIds.length} of ${allTopics.length} roadmap topics completed`}
          progress={overallProgress}
        />

        {lastViewedTopic ? (
          <LiquidCard accentColor={theme.colors.primary}>
            <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              CONTINUE LEARNING
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '800', marginTop: spacing.xs }}>
              {lastViewedTopic.title}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}>
              Example {lastViewedTopic.exampleNumber} of 50
            </Text>
            <Button
              mode="contained"
              icon="play-circle-outline"
              style={styles.resumeButton}
              onPress={() => router.push(`/topic/${lastViewedTopic.topicId}`)}
            >
              Resume Learning
            </Button>
          </LiquidCard>
        ) : null}

        <QuickWinCard quickWin={quickWin} onComplete={() => recordActivity(1)} />
      </View>

      <SectionHeader
        title="Core Technologies"
        actionLabel="See All"
        onAction={() => router.push('/(tabs)/categories')}
      />

      <View style={styles.grid}>
        {categories.map((category) => {
          const completedInCat = category.topics.filter((t) =>
            completedTopicIds.includes(t.id)
          ).length;
          return (
            <CategoryCard
              key={category.id}
              category={category}
              completedCount={completedInCat}
              compact
              onPress={() => router.push(`/category/${category.id}`)}
            />
          );
        })}
      </View>

      <SectionHeader
        title="Recommended Questions"
        actionLabel="Browse"
        onAction={() => router.push('/(tabs)/search')}
      />

      <View style={styles.stack}>
        {recommendedQuestions.map((q) => (
          <Pressable
            key={q.id}
            onPress={() => router.push(`/question/${q.id}`)}
            accessibilityRole="button"
            accessibilityLabel={q.title}
          >
            <LiquidCard>
              <DifficultyBadge level={q.difficulty} />
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: spacing.xs }}
              >
                {q.title}
              </Text>
              <Text
                variant="bodySmall"
                numberOfLines={2}
                style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}
              >
                {q.shortAnswer}
              </Text>
            </LiquidCard>
          </Pressable>
        ))}
      </View>

      <SectionHeader
        title="Recent Mock Interviews"
        actionLabel="Practice"
        onAction={() => router.push('/(tabs)/interview')}
      />

      <LiquidCard variant="tonal">
        {recentMockScores.length === 0 ? (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            No mock interviews yet. Complete your first session in Phase 6 to see score trends here.
          </Text>
        ) : (
          recentMockScores.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.mockRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                {item.modeLabel}
              </Text>
              <Text variant="titleSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                {item.score}/10
              </Text>
            </View>
          ))
        )}
      </LiquidCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  topActionsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  headerIconBtn: {
    margin: 0,
    width: 34,
    height: 34,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.xs + 2,
  },
  tipIcon: {
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    lineHeight: 18,
  },
  stack: {
    gap: spacing.md,
  },
  resumeButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  mockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
});
