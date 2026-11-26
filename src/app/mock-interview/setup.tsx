import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { CATEGORIES } from '@/content/categories';
import { INTERVIEW_MODES } from '@/content/interviewModes';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInterviewStore } from '@/store/useInterviewStore';
import { spacing } from '@/theme/spacing';
import type { DifficultyLevel, TechnologyId } from '@/types/content';
import type { MockInterviewModeId } from '@/types/interview';

export default function MockInterviewSetupScreen() {
  const { theme } = useAppTheme();
  const startSession = useInterviewStore((s) => s.startSession);

  const [selectedModeId, setSelectedModeId] = useState<MockInterviewModeId>('beginner');
  const [customDifficulties, setCustomDifficulties] = useState<DifficultyLevel[]>([
    'beginner',
    'intermediate',
  ]);
  const [customCategories, setCustomCategories] = useState<TechnologyId[]>(['javascript']);
  const [customCount, setCustomCount] = useState<number>(5);

  const selectedMode =
    INTERVIEW_MODES.find((m) => m.id === selectedModeId) ?? INTERVIEW_MODES[0];

  const toggleDifficulty = (lvl: DifficultyLevel) => {
    setCustomDifficulties((prev) =>
      prev.includes(lvl)
        ? prev.length > 1
          ? prev.filter((d) => d !== lvl)
          : prev
        : [...prev, lvl]
    );
  };

  const toggleCategory = (cat: TechnologyId) => {
    setCustomCategories((prev) =>
      prev.includes(cat)
        ? prev.length > 1
          ? prev.filter((c) => c !== cat)
          : prev
        : [...prev, cat]
    );
  };

  const handleStart = () => {
    startSession({
      modeId: selectedMode.id,
      modeTitle: selectedMode.title,
      categories:
        selectedMode.id === 'custom' ? customCategories : selectedMode.categories,
      difficulties:
        selectedMode.id === 'custom' ? customDifficulties : selectedMode.difficulties,
      count: selectedMode.id === 'custom' ? customCount : selectedMode.defaultCount,
      secondsPerQuestion: selectedMode.secondsPerQuestion,
    });
    router.replace('/mock-interview/session');
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <IconButton
          icon="arrow-left"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/interview'))}
          accessibilityLabel="Back"
        />
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
          Choose Interview Mode
        </Text>
      </View>

      <View style={styles.modesGrid}>
        {INTERVIEW_MODES.map((mode) => {
          const isSelected = mode.id === selectedModeId;
          return (
            <Pressable
              key={mode.id}
              onPress={() => setSelectedModeId(mode.id)}
              accessibilityRole="button"
              accessibilityLabel={`${mode.title} interview mode`}
            >
              <LiquidCard
                variant={isSelected ? 'tonal' : 'surface'}
                style={
                  isSelected
                    ? { borderColor: theme.colors.primary, borderWidth: 1.5 }
                    : undefined
                }
              >
                <View style={styles.modeHeader}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                    {mode.title}
                  </Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                    {mode.defaultCount} Qs • {mode.secondsPerQuestion}s
                  </Text>
                </View>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  {mode.description}
                </Text>
              </LiquidCard>
            </Pressable>
          );
        })}
      </View>

      {selectedModeId === 'custom' ? (
        <LiquidCard style={styles.customBox}>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            Custom Settings
          </Text>

          <Text variant="labelMedium" style={[styles.customLabel, { color: theme.colors.onSurfaceVariant }]}>
            Difficulty
          </Text>
          <View style={styles.chipsWrap}>
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <Chip
                key={lvl}
                selected={customDifficulties.includes(lvl)}
                onPress={() => toggleDifficulty(lvl)}
                compact
              >
                {lvl}
              </Chip>
            ))}
          </View>

          <Text variant="labelMedium" style={[styles.customLabel, { color: theme.colors.onSurfaceVariant }]}>
            Technologies
          </Text>
          <View style={styles.chipsWrap}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                selected={customCategories.includes(cat.id)}
                onPress={() => toggleCategory(cat.id)}
                compact
              >
                {cat.name}
              </Chip>
            ))}
          </View>

          <Text variant="labelMedium" style={[styles.customLabel, { color: theme.colors.onSurfaceVariant }]}>
            Questions: {customCount}
          </Text>
          <View style={styles.chipsWrap}>
            {[3, 5, 8, 10].map((n) => (
              <Chip
                key={n}
                selected={customCount === n}
                onPress={() => setCustomCount(n)}
                compact
              >
                {n} Questions
              </Chip>
            ))}
          </View>
        </LiquidCard>
      ) : null}

      <Button
        mode="contained"
        icon="play"
        style={styles.startBtn}
        onPress={handleStart}
      >
        Start {selectedMode.title} Interview
      </Button>
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
  modesGrid: {
    gap: spacing.sm,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customBox: {
    marginTop: spacing.md,
  },
  customLabel: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  startBtn: {
    marginTop: spacing.lg,
  },
});
