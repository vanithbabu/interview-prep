import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme/spacing';

export function AppSplashScreen() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View
        style={[
          styles.logoBox,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <MaterialCommunityIcons
          name="code-braces-box"
          size={52}
          color={theme.colors.primary}
        />
      </View>

      <Text
        variant="headlineMedium"
        style={{ color: theme.colors.onBackground, fontWeight: '800', marginTop: spacing.lg }}
      >
        Interview Prep
      </Text>
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.xs }}
      >
        JavaScript • React • Next.js • WordPress • AI • TypeScript
      </Text>

      <ActivityIndicator
        size="small"
        color={theme.colors.primary}
        style={styles.spinner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginTop: spacing.xl,
  },
});
