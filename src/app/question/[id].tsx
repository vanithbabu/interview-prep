import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Text, TextInput } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useBookmarksStore } from '@/store/useBookmarksStore';
import { useContentStore } from '@/store/useContentStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';
import { spacing } from '@/theme/spacing';

export default function QuestionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();
  const hapticsEnabled = useThemeStore((s) => s.hapticsEnabled);

  const answeredQuestionResults = useProgressStore((s) => s.answeredQuestionResults);
  const markQuestionResult = useProgressStore((s) => s.markQuestionResult);

  const bookmarkedQuestionIds = useBookmarksStore((s) => s.bookmarkedQuestionIds);
  const notesById = useBookmarksStore((s) => s.notesById);
  const toggleBookmarkQuestion = useBookmarksStore((s) => s.toggleBookmarkQuestion);
  const saveNote = useBookmarksStore((s) => s.saveNote);

  const questions = useContentStore((s) => s.questions);
  const question = questions.find((q) => q.id === (id ?? ''));
  const [noteDraft, setNoteDraft] = useState(notesById[id ?? ''] ?? '');
  const [noteSaved, setNoteSaved] = useState(false);

  if (!question) {
    return (
      <ScreenContainer scrollable={false}>
        <EmptyState
          icon="help-circle-outline"
          title="Question Not Found"
          description="This interview question could not be found."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  const isBookmarked = bookmarkedQuestionIds.includes(question.id);
  const currentResult = answeredQuestionResults[question.id];

  const handleMarkResult = async (result: 'correct' | 'review') => {
    if (hapticsEnabled) {
      await Haptics.notificationAsync(
        result === 'correct'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );
    }
    markQuestionResult(question.id, result);
  };

  const handleSaveNote = () => {
    saveNote(question.id, noteDraft);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <IconButton
          icon="arrow-left"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          accessibilityLabel="Go back"
        />
        <View style={styles.headerMeta}>
          <DifficultyBadge level={question.difficulty} />
        </View>
        <IconButton
          icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          iconColor={isBookmarked ? theme.colors.primary : theme.colors.onSurfaceVariant}
          onPress={() => toggleBookmarkQuestion(question.id)}
          accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
        />
      </View>

      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
        {question.title}
      </Text>

      <View style={styles.stack}>
        <LiquidCard variant="tonal">
          <Text variant="labelLarge" style={[styles.label, { color: theme.colors.primary }]}>
            HOW TO SAY THIS IN AN INTERVIEW (HUMAN-STYLE)
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, lineHeight: 24 }}>
            “{question.humanInterviewAnswer}”
          </Text>
        </LiquidCard>

        <LiquidCard>
          <Text variant="labelLarge" style={[styles.label, { color: theme.colors.secondary }]}>
            SHORT ANSWER
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            {question.shortAnswer}
          </Text>

          <Text variant="labelLarge" style={[styles.label, styles.spaced, { color: theme.colors.secondary }]}>
            DETAILED EXPLANATION
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {question.detailedExplanation}
          </Text>

          <Text variant="labelLarge" style={[styles.label, styles.spaced, { color: theme.colors.secondary }]}>
            PRACTICAL EXAMPLE
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            {question.practicalExample}
          </Text>
        </LiquidCard>

        {question.codeExample ? (
          <LiquidCard>
            <Text variant="labelLarge" style={[styles.label, { color: theme.colors.secondary }]}>
              CODE EXAMPLE & OUTPUT
            </Text>
            <CodeBlock
              code={question.codeExample.code}
              expectedOutput={question.codeExample.expectedOutput}
              showOutput
            />
          </LiquidCard>
        ) : null}

        <LiquidCard>
          <Text variant="labelLarge" style={[styles.label, { color: theme.colors.primary }]}>
            WHAT INTERVIEWERS LOOK FOR
          </Text>
          {question.interviewerExpectations.map((item, idx) => (
            <Text key={idx} variant="bodyMedium" style={[styles.bullet, { color: theme.colors.onSurface }]}>
              • {item}
            </Text>
          ))}

          <Text variant="labelLarge" style={[styles.label, styles.spaced, { color: theme.colors.secondary }]}>
            FOLLOW-UP QUESTIONS
          </Text>
          {question.followUpQuestions.map((fq, idx) => (
            <Text key={idx} variant="bodyMedium" style={[styles.bullet, { color: theme.colors.onSurfaceVariant }]}>
              {idx + 1}. {fq}
            </Text>
          ))}

          <View style={styles.tagsRow}>
            {question.tags.map((tag) => (
              <Chip key={tag} compact>
                #{tag}
              </Chip>
            ))}
          </View>
        </LiquidCard>

        <LiquidCard>
          <Text variant="labelLarge" style={[styles.label, { color: theme.colors.secondary }]}>
            YOUR PRACTICE STATUS
          </Text>
          <View style={styles.statusRow}>
            <Button
              mode={currentResult === 'correct' ? 'contained' : 'contained-tonal'}
              icon="check-circle-outline"
              style={styles.flexBtn}
              onPress={() => handleMarkResult('correct')}
            >
              Got It
            </Button>
            <Button
              mode={currentResult === 'review' ? 'contained' : 'outlined'}
              icon="refresh"
              style={styles.flexBtn}
              onPress={() => handleMarkResult('review')}
            >
              Needs Review
            </Button>
          </View>

          <Text variant="labelLarge" style={[styles.label, styles.spaced, { color: theme.colors.secondary }]}>
            PERSONAL STUDY NOTES
          </Text>
          <TextInput
            mode="outlined"
            multiline
            placeholder="Write your own summary or memory hook..."
            value={noteDraft}
            onChangeText={setNoteDraft}
            style={styles.noteInput}
          />
          <Button mode="text" style={styles.saveNoteBtn} onPress={handleSaveNote}>
            {noteSaved ? 'Note Saved!' : 'Save Note'}
          </Button>
        </LiquidCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -spacing.sm,
    marginBottom: spacing.xs,
  },
  headerMeta: {
    flex: 1,
  },
  title: {
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  stack: {
    gap: spacing.md,
  },
  label: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  spaced: {
    marginTop: spacing.md,
  },
  bullet: {
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  flexBtn: {
    flex: 1,
  },
  noteInput: {
    minHeight: 80,
  },
  saveNoteBtn: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
});
