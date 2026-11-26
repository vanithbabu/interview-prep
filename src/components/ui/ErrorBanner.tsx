import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme/spacing';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  const { theme } = useAppTheme();

  return (
    <Surface
      elevation={0}
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.errorContainer,
          borderRadius: radius.md,
        },
      ]}
      accessibilityRole="alert"
    >
      <View style={styles.content}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer, flex: 1 }}>
          {message}
        </Text>
        {onRetry ? (
          <Button
            mode="text"
            compact
            textColor={theme.colors.onErrorContainer}
            onPress={onRetry}
          >
            Retry
          </Button>
        ) : null}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
