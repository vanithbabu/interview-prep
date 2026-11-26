import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';

import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useThemeStore } from '@/store/useThemeStore';
import { radius, spacing } from '@/theme/spacing';
import type { DailyQuickWin } from '@/types/content';

interface QuickWinCardProps {
  quickWin: DailyQuickWin;
  onComplete: () => void;
}

export function QuickWinCard({ quickWin, onComplete }: QuickWinCardProps) {
  const { theme } = useAppTheme();
  const hapticsEnabled = useThemeStore((s) => s.hapticsEnabled);
  const [revealed, setRevealed] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleMarkDone = async () => {
    if (claimed) return;
    if (hapticsEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setClaimed(true);
    onComplete();
  };

  return (
    <LiquidCard>
      <View style={styles.header}>
        <Text variant="labelLarge" style={{ color: theme.colors.secondary, fontWeight: '700' }}>
          DAILY QUICK WIN (2 MIN)
        </Text>
      </View>

      <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
        {quickWin.question}
      </Text>

      {quickWin.codeSnippet ? (
        <Surface
          elevation={0}
          style={[styles.codeBox, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <Text variant="bodySmall" style={[styles.codeText, { color: theme.colors.onSurface }]}>
            {quickWin.codeSnippet}
          </Text>
        </Surface>
      ) : null}

      {revealed ? (
        <Surface
          elevation={0}
          style={[styles.answerBox, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
            {quickWin.answer}
          </Text>
        </Surface>
      ) : null}

      <View style={styles.actions}>
        <Button mode="text" compact onPress={() => setRevealed((prev) => !prev)}>
          {revealed ? 'Hide Answer' : 'Show Answer'}
        </Button>
        <Button
          mode={claimed ? 'outlined' : 'contained-tonal'}
          compact
          disabled={claimed}
          onPress={handleMarkDone}
        >
          {claimed ? 'Completed Today' : 'Mark Done (+1)'}
        </Button>
      </View>
    </LiquidCard>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xs,
  },
  codeBox: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  codeText: {
    fontFamily: 'monospace',
  },
  answerBox: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
