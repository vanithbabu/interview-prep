import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Searchbar, SegmentedButtons, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { SearchResultCard } from '@/features/search/SearchResultCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  filterQuestions,
  filterTopics,
  type SearchStatusFilter,
} from '@/services/searchService';
import { useBookmarksStore } from '@/store/useBookmarksStore';
import { useContentStore } from '@/store/useContentStore';
import { useProgressStore } from '@/store/useProgressStore';
import { spacing } from '@/theme/spacing';
import type { DifficultyLevel } from '@/types/content';

type ResultScope = 'all' | 'questions' | 'topics';

export default function SearchScreen() {
  const { theme } = useAppTheme();

  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<ResultScope>('all');
  const [difficulty, setDifficulty] = useState<'all' | DifficultyLevel>('all');
  const [status, setStatus] = useState<SearchStatusFilter>('all');

  const debouncedQuery = useDebouncedValue(query, 200);

  const categories = useContentStore((s) => s.categories);
  const allQuestions = useContentStore((s) => s.questions);
  const allTopics = useMemo(() => categories.flatMap((c) => c.topics), [categories]);

  const bookmarkedQuestionIds = useBookmarksStore((s) => s.bookmarkedQuestionIds);
  const bookmarkedExampleIds = useBookmarksStore((s) => s.bookmarkedExampleIds);
  const notesById = useBookmarksStore((s) => s.notesById);
  const answeredQuestionResults = useProgressStore((s) => s.answeredQuestionResults);

  const topics = useMemo(() => {
    if (scope === 'questions' || status !== 'all') return [];
    return filterTopics(allTopics, { query: debouncedQuery, difficulty, category: 'all' });
  }, [allTopics, scope, status, debouncedQuery, difficulty]);

  const questions = useMemo(() => {
    if (scope === 'topics') return [];
    return filterQuestions(allQuestions, {
      query: debouncedQuery,
      difficulty,
      category: 'all',
      status,
      bookmarkedQuestionIds,
      answeredQuestionResults,
      notesById,
    });
  }, [
    allQuestions,
    scope,
    debouncedQuery,
    difficulty,
    status,
    bookmarkedQuestionIds,
    answeredQuestionResults,
    notesById,
  ]);

  const clearFilters = () => {
    setQuery('');
    setScope('all');
    setDifficulty('all');
    setStatus('all');
  };

  const totalResults = topics.length + questions.length;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
          Search & Bookmarks
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {bookmarkedQuestionIds.length} bookmarked Q&As • {bookmarkedExampleIds.length} bookmarked examples
        </Text>
      </View>

      <Searchbar
        placeholder="Search topics, questions, tags, or notes..."
        value={query}
        onChangeText={setQuery}
        style={[styles.searchbar, { backgroundColor: theme.colors.surface }]}
        accessibilityLabel="Search topics and questions"
      />

      <SegmentedButtons
        value={scope}
        onValueChange={(v) => setScope(v as ResultScope)}
        style={styles.segmented}
        buttons={[
          { value: 'all', label: 'All' },
          { value: 'questions', label: 'Questions' },
          { value: 'topics', label: 'Topics' },
        ]}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
          <Chip
            key={lvl}
            selected={difficulty === lvl}
            onPress={() => setDifficulty(lvl)}
            compact
          >
            {lvl === 'all' ? 'All Levels' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {(
          [
            { key: 'all', label: 'All Status' },
            { key: 'bookmarked', label: 'Bookmarked' },
            { key: 'unanswered', label: 'Unanswered' },
            { key: 'review', label: 'Needs Review' },
          ] as const
        ).map((item) => (
          <Chip
            key={item.key}
            selected={status === item.key}
            onPress={() => setStatus(item.key)}
            compact
          >
            {item.label}
          </Chip>
        ))}
      </ScrollView>

      {bookmarkedExampleIds.length > 0 && status === 'bookmarked' ? (
        <LiquidCard variant="tonal" style={styles.examplesBanner}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            Bookmarked Code Examples ({bookmarkedExampleIds.length})
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
            {bookmarkedExampleIds.join(', ')}
          </Text>
        </LiquidCard>
      ) : null}

      {totalResults === 0 ? (
        <EmptyState
          icon="magnify-close"
          title="No Matching Results"
          description="Try clearing your search query or switching difficulty/status filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <View style={styles.resultsList}>
          {questions.map((q) => {
            const res = answeredQuestionResults[q.id];
            return (
              <SearchResultCard
                key={q.id}
                kind="question"
                title={q.title}
                subtitle={q.shortAnswer}
                difficulty={q.difficulty}
                isBookmarked={bookmarkedQuestionIds.includes(q.id)}
                statusLabel={
                  res === 'correct' ? 'Got It' : res === 'review' ? 'Needs Review' : undefined
                }
                notePreview={notesById[q.id]}
                onPress={() => router.push(`/question/${q.id}`)}
              />
            );
          })}

          {topics.map((topic) => (
            <SearchResultCard
              key={topic.id}
              kind="topic"
              title={topic.title}
              subtitle={topic.description}
              difficulty={topic.level}
              onPress={() => router.push(`/topic/${topic.id}`)}
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
    gap: 2,
  },
  searchbar: {
    marginBottom: spacing.sm,
  },
  segmented: {
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  examplesBanner: {
    marginBottom: spacing.md,
  },
  resultsList: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
});
