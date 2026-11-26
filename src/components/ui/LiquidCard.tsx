import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme/spacing';

interface LiquidCardProps {
  children: React.ReactNode;
  variant?: 'surface' | 'tonal';
  accentColor?: string;
  style?: ViewStyle;
}

export function LiquidCard({
  children,
  variant = 'surface',
  accentColor,
  style,
}: LiquidCardProps) {
  const { theme } = useAppTheme();

  return (
    <Surface
      elevation={variant === 'surface' ? 1 : 0}
      style={[
        styles.card,
        {
          backgroundColor:
            variant === 'surface' ? theme.colors.surface : theme.colors.surfaceVariant,
          borderRadius: radius.lg,
          borderColor: accentColor ? `${accentColor}55` : theme.colors.outline,
        },
        style,
      ]}
    >
      {accentColor ? (
        <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />
      ) : null}
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentStrip: {
    height: 3,
    width: 40,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
});
