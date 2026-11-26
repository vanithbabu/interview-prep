import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius } from '@/theme/spacing';

interface LiquidProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  height?: number;
}

export function LiquidProgressBar({
  progress,
  color,
  trackColor,
  height = 8,
}: LiquidProgressBarProps) {
  const { theme } = useAppTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  const widthPercent = `${Math.round(clamped * 100)}%` as const;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor ?? theme.colors.surfaceVariant,
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <View
        style={[
          styles.fill,
          {
            width: widthPercent,
            backgroundColor: color ?? theme.colors.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
