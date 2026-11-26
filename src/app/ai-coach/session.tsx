import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Text, TextInput } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { CATEGORIES } from '@/content/categories';
import { useAppTheme } from '@/hooks/useAppTheme';
import { submitAICoachTurn } from '@/services/aiCoachService';
import { useProgressStore } from '@/store/useProgressStore';
import { spacing } from '@/theme/spacing';
import type {
  AICoachHistoryTurn,
  AICoachLevel,
  AICoachTurnResponse,
} from '@/types/ai';
import type { TechnologyId } from '@/types/content';

const ROLES = ['Frontend Developer', 'React Developer', 'Next.js Developer', 'Full Stack AI'];
const OPENING_QUESTIONS: Record<AICoachLevel, string> = {
  beginner: 'Explain the difference between `let`, `const`, and `var` in JavaScript.',
  intermediate: 'What is a closure in JavaScript, and how would you use one in a real app?',
  advanced: 'Walk through the JavaScript Event Loop, microtasks, and macrotasks.',
  senior: 'How would you architect a search-as-you-type input to avoid wasted API calls and stale race conditions?',
};

export default function AICoachSessionScreen() {
  const { theme } = useAppTheme();
  const recordActivity = useProgressStore((s) => s.recordActivity);

  const [role, setRole] = useState(ROLES[0]);
  const [categoryId, setCategoryId] = useState<'all' | TechnologyId>('all');
  const [level, setLevel] = useState<AICoachLevel>('intermediate');
  const [started, setStarted] = useState(false);

  const [sessionId] = useState(() => `ai-${Date.now()}`);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(OPENING_QUESTIONS.intermediate);
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<AICoachHistoryTurn[]>([]);
  const [lastTurn, setLastTurn] = useState<AICoachTurnResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setStarted(true);
    setQuestionIndex(0);
    setCurrentQuestion(OPENING_QUESTIONS[level]);
    setHistory([]);
    setLastTurn(null);
    setError(null);
  };

  const handleSendAnswer = async () => {
    const trimmed = answer.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await submitAICoachTurn({
        sessionId,
        categoryId,
        role,
        level,
        questionIndex,
        currentQuestion,
        candidateAnswer: trimmed,
        history,
      });

      setHistory((prev) => [
        ...prev,
        { question: currentQuestion, answer: trimmed, score: response.evaluation.score },
      ]);
      setLastTurn(response);
      setAnswer('');
      recordActivity(1);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? `${err.message}. Make sure the Express backend is running on port 4000.`
          : 'Unable to reach AI Coach backend.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdvance = () => {
    if (!lastTurn?.nextPrompt) return;
    setCurrentQuestion(lastTurn.nextPrompt);
    setQuestionIndex((i) => i + 1);
    setLastTurn(null);
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <IconButton
          icon="arrow-left"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/interview'))}
          accessibilityLabel="Go back"
        />
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
          AI Interview Coach
        </Text>
      </View>

      {error ? <ErrorBanner message={error} onRetry={handleSendAnswer} /> : null}

      {!started ? (
        <LiquidCard>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            Configure Your AI Interview
          </Text>

          <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            Target Role
          </Text>
          <View style={styles.chipsWrap}>
            {ROLES.map((r) => (
              <Chip key={r} selected={role === r} onPress={() => setRole(r)} compact>
                {r}
              </Chip>
            ))}
          </View>

          <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            Technology Focus
          </Text>
          <View style={styles.chipsWrap}>
            <Chip
              selected={categoryId === 'all'}
              onPress={() => setCategoryId('all')}
              compact
            >
              All 6
            </Chip>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                selected={categoryId === cat.id}
                onPress={() => setCategoryId(cat.id)}
                compact
              >
                {cat.name}
              </Chip>
            ))}
          </View>

          <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            Experience Level
          </Text>
          <View style={styles.chipsWrap}>
            {(['beginner', 'intermediate', 'advanced', 'senior'] as const).map((lvl) => (
              <Chip key={lvl} selected={level === lvl} onPress={() => setLevel(lvl)} compact>
                {lvl}
              </Chip>
            ))}
          </View>

          <Button mode="contained" style={styles.startBtn} onPress={handleStart}>
            Start AI Coach Session
          </Button>
        </LiquidCard>
      ) : lastTurn?.finalReport ? (
        <LiquidCard variant="tonal">
          <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            FINAL PERFORMANCE REPORT
          </Text>
          <Text variant="displaySmall" style={{ color: theme.colors.onSurface, fontWeight: '800', marginTop: spacing.xs }}>
            {lastTurn.finalReport.overallScore} / 10
          </Text>
          <Text variant="titleMedium" style={{ color: theme.colors.secondary, marginBottom: spacing.md }}>
            {lastTurn.finalReport.readinessLevel}
          </Text>

          <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
            Top Strengths
          </Text>
          {lastTurn.finalReport.topStrengths.map((s, i) => (
            <Text key={i} variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              • {s}
            </Text>
          ))}

          <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
            Action Plan
          </Text>
          {lastTurn.finalReport.actionPlan.map((a, i) => (
            <Text key={i} variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              • {a}
            </Text>
          ))}

          <Button mode="contained" style={styles.startBtn} onPress={handleStart}>
            Start New Session
          </Button>
        </LiquidCard>
      ) : (
        <View style={styles.stack}>
          <LiquidCard>
            <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {role.toUpperCase()} • {level.toUpperCase()} • TURN {questionIndex + 1}
            </Text>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: spacing.xs }}>
              {currentQuestion}
            </Text>

            {!lastTurn ? (
              <>
                <TextInput
                  mode="outlined"
                  multiline
                  placeholder="Type your answer here..."
                  value={answer}
                  onChangeText={setAnswer}
                  style={styles.input}
                />
                <Button
                  mode="contained"
                  loading={loading}
                  disabled={loading || answer.trim().length === 0}
                  style={styles.startBtn}
                  onPress={handleSendAnswer}
                >
                  Submit to AI Coach
                </Button>
              </>
            ) : null}
          </LiquidCard>

          {lastTurn ? (
            <LiquidCard variant="tonal">
              <View style={styles.scoreRow}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
                  Coach Evaluation
                </Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '800' }}>
                  {lastTurn.evaluation.score}/10
                </Text>
              </View>

              {lastTurn.evaluation.missingConcepts.length > 0 ? (
                <Text variant="bodySmall" style={{ color: theme.custom.warning, marginTop: spacing.sm }}>
                  Missing: {lastTurn.evaluation.missingConcepts.join(', ')}
                </Text>
              ) : null}

              {lastTurn.evaluation.mistakesExplained.map((m, idx) => (
                <Text key={idx} variant="bodySmall" style={{ color: theme.colors.error, marginTop: spacing.xs }}>
                  • {m}
                </Text>
              ))}

              <Text variant="labelLarge" style={[styles.label, { color: theme.colors.secondary }]}>
                Suggested Better Answer
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                “{lastTurn.evaluation.betterAnswer}”
              </Text>

              <Button mode="contained" style={styles.startBtn} onPress={handleAdvance}>
                {lastTurn.nextAction === 'follow_up' ? 'Answer Follow-Up' : 'Next Question'}
              </Button>
            </LiquidCard>
          ) : null}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -spacing.sm,
    marginBottom: spacing.md,
  },
  stack: {
    gap: spacing.md,
  },
  label: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  input: {
    marginTop: spacing.md,
    minHeight: 110,
  },
  startBtn: {
    marginTop: spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
