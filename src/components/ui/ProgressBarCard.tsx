import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { LiquidCard } from '@/components/ui/LiquidCard';
import { LiquidProgressBar } from '@/components/ui/LiquidProgressBar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing } from '@/theme/spacing';

interface ProgressBarCardProps {
  title: string;
  subtitle: string;
  progress: number; // 0 to 1
  accentColor?: string;
}

export function ProgressBarCard({
  title,
  subtitle,
  progress,
  accentColor,
}: ProgressBarCardProps) {
  const { theme } = useAppTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  const percent = Math.round(clamped * 100);

  return (
    <LiquidCard>
      <View style={styles.header}>
        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
          {title}
        </Text>
        <Text
          variant="labelLarge"
          style={{ color: accentColor ?? theme.colors.primary, fontWeight: '700' }}
        >
          {percent}%
        </Text>
      </View>
      <View style={styles.barWrap}>
        <LiquidProgressBar
          progress={clamped}
          color={accentColor ?? theme.colors.primary}
        />
      </View>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {subtitle}
      </Text>
    </LiquidCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  barWrap: {
    marginBottom: spacing.sm,
  },
});
