import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, ProgressBar, Text, TextInput } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useThemeStore } from '@/store/useThemeStore';
import { radius, spacing } from '@/theme/spacing';
import type { MockAnswerEvaluation } from '@/types/interview';

export default function MockInterviewSessionScreen() {
  const { theme } = useAppTheme();
  const hapticsEnabled = useThemeStore((s) => s.hapticsEnabled);

  const activeSession = useInterviewStore((s) => s.activeSession);
  const submitCurrentAnswer = useInterviewStore((s) => s.submitCurrentAnswer);
  const advanceOrFinish = useInterviewStore((s) => s.advanceOrFinish);
  const clearActiveSession = useInterviewStore((s) => s.clearActiveSession);
  const addRecentMockScore = useProgressStore((s) => s.addRecentMockScore);

  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<MockAnswerEvaluation | null>(null);

  const handleSubmit = useCallback(
    async (timedOut = false) => {
      if (evaluation) return;
      const result = submitCurrentAnswer(answer, timedOut);
      if (result) {
        if (hapticsEnabled) {
          await Haptics.notificationAsync(
            result.score >= 7
              ? Haptics.NotificationFeedbackType.Success
              : Haptics.NotificationFeedbackType.Warning
          );
        }
        setEvaluation(result);
      }
    },
    [answer, evaluation, hapticsEnabled, submitCurrentAnswer]
  );

  const { secondsLeft, reset, pause } = useCountdownTimer(
    activeSession?.secondsPerQuestion ?? 120,
    () => {
      handleSubmit(true);
    }
  );

  if (!activeSession) {
    return (
      <ScreenContainer scrollable={false}>
        <EmptyState
          icon="microphone-off"
          title="No Active Session"
          description="Choose an interview mode to start a timed mock interview."
          actionLabel="Setup Interview"
          onAction={() => router.replace('/mock-interview/setup')}
        />
      </ScreenContainer>
    );
  }

  const question = activeSession.questions[activeSession.currentIndex];
  const progress = (activeSession.currentIndex + 1) / activeSession.questions.length;

  const onSubmitPress = () => {
    pause();
    handleSubmit(false);
  };

  const onNextPress = () => {
    const finishedRecord = advanceOrFinish();
    if (finishedRecord) {
      addRecentMockScore({
        id: finishedRecord.id,
        modeLabel: finishedRecord.modeTitle,
        score: finishedRecord.averageScore,
        dateIso: finishedRecord.createdAtIso,
      });
      router.replace('/mock-interview/summary');
      return;
    }
    setAnswer('');
    setEvaluation(null);
    reset(activeSession.secondsPerQuestion);
  };

  const handleQuit = () => {
    clearActiveSession();
    router.replace('/(tabs)/interview');
  };

  if (!question) return null;

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <IconButton icon="close" onPress={handleQuit} accessibilityLabel="Exit interview" />
        <View style={styles.topMeta}>
          <Text variant="titleSmall" style={{ color: theme.colors.onBackground, fontWeight: '700' }}>
            {activeSession.modeTitle} • Q{activeSession.currentIndex + 1}/{activeSession.questions.length}
          </Text>
        </View>
        <Chip
          compact
          icon="timer-outline"
          textStyle={{
            color: secondsLeft <= 15 ? theme.colors.error : theme.colors.primary,
            fontWeight: '700',
          }}
        >
          {secondsLeft}s
        </Chip>
      </View>

      <ProgressBar
        progress={progress}
        color={theme.colors.primary}
        style={[styles.bar, { backgroundColor: theme.colors.surfaceVariant }]}
      />

      <LiquidCard>
        <DifficultyBadge level={question.difficulty} />
        <Text
          variant="titleLarge"
          style={{ color: theme.colors.onSurface, fontWeight: '800', marginTop: spacing.sm }}
        >
          {question.title}
        </Text>

        <TextInput
          mode="outlined"
          multiline
          placeholder="Explain your answer as if speaking to an interviewer..."
          value={answer}
          onChangeText={setAnswer}
          disabled={Boolean(evaluation)}
          style={styles.input}
        />

        {!evaluation ? (
          <Button
            mode="contained"
            style={styles.submitBtn}
            onPress={onSubmitPress}
          >
            Submit Answer
          </Button>
        ) : null}
      </LiquidCard>

      {evaluation ? (
        <LiquidCard variant="tonal" style={styles.evalCard}>
          <View style={styles.scoreRow}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
              Evaluation Score
            </Text>
            <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '800' }}>
              {evaluation.score}/10
            </Text>
          </View>

          {evaluation.missingConcepts.length > 0 ? (
            <View style={styles.section}>
              <Text variant="labelLarge" style={{ color: theme.custom.warning, fontWeight: '700' }}>
                MISSING CONCEPTS TO MENTION
              </Text>
              <View style={styles.chipsWrap}>
                {evaluation.missingConcepts.map((c) => (
                  <Chip key={c} compact>
                    {c}
                  </Chip>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text variant="labelLarge" style={{ color: theme.colors.secondary, fontWeight: '700' }}>
              EXPECTED CORE ANSWER
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {evaluation.expectedAnswer}
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              IMPROVED HUMAN-STYLE ANSWER
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              “{evaluation.improvedAnswer}”
            </Text>
          </View>

          <Button mode="contained" style={styles.nextBtn} onPress={onNextPress}>
            {activeSession.currentIndex + 1 < activeSession.questions.length
              ? 'Next Question'
              : 'Finish & View Summary'}
          </Button>
        </LiquidCard>
      ) : null}
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
  topMeta: {
    flex: 1,
  },
  bar: {
    height: 6,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  input: {
    marginTop: spacing.md,
    minHeight: 120,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
  evalCard: {
    marginTop: spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    marginTop: spacing.md,
    gap: 4,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 4,
  },
  nextBtn: {
    marginTop: spacing.lg,
  },
});
