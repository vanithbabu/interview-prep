import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme/spacing';
import type { TopicDetail } from '@/types/content';

interface TopicOverviewTabProps {
  topic: TopicDetail;
}

export function TopicOverviewTab({ topic }: TopicOverviewTabProps) {
  const { theme } = useAppTheme();

  const renderBullets = (items: string[]) =>
    items.map((item, idx) => (
      <Text key={idx} variant="bodyMedium" style={[styles.bullet, { color: theme.colors.onSurface }]}>
        • {item}
      </Text>
    ));

  return (
    <View style={styles.stack}>
      <LiquidCard>
        <Text variant="titleMedium" style={[styles.heading, { color: theme.colors.primary }]}>
          1. Introduction & Simple Explanation
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          {topic.introduction}
        </Text>
        <Text variant="bodyMedium" style={[styles.spacedText, { color: theme.colors.onSurfaceVariant }]}>
          {topic.simpleExplanation}
        </Text>
      </LiquidCard>

      <LiquidCard>
        <Text variant="titleMedium" style={[styles.heading, { color: theme.colors.primary }]}>
          2. Why We Use It & How It Works Internally
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          {topic.whyWeUseIt}
        </Text>
        <Text variant="bodyMedium" style={[styles.spacedText, { color: theme.colors.onSurfaceVariant }]}>
          {topic.howItWorksInternally}
        </Text>
      </LiquidCard>

      <LiquidCard>
        <Text variant="titleMedium" style={[styles.heading, { color: theme.colors.primary }]}>
          3. Syntax Variations
        </Text>
        {topic.syntaxVariations.map((v) => (
          <View key={v.label} style={styles.syntaxItem}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              {v.label}
            </Text>
            <Text
              variant="bodySmall"
              style={[
                styles.syntaxCode,
                { color: theme.colors.onSurfaceVariant, backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              {v.pattern}
            </Text>
          </View>
        ))}
      </LiquidCard>

      <LiquidCard>
        <Text variant="titleMedium" style={[styles.heading, { color: theme.colors.primary }]}>
          4. Real-World Usage & Advanced Use Cases
        </Text>
        {renderBullets([...topic.realWorldUsage, ...topic.advancedUseCases])}
      </LiquidCard>

      <LiquidCard>
        <Text variant="titleMedium" style={[styles.heading, { color: theme.colors.error }]}>
          5. Common Mistakes
        </Text>
        {renderBullets(topic.commonMistakes)}
      </LiquidCard>

      <LiquidCard>
        <Text variant="titleMedium" style={[styles.heading, { color: theme.custom.success }]}>
          6. Best Practices
        </Text>
        {renderBullets(topic.bestPractices)}
      </LiquidCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  heading: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  spacedText: {
    marginTop: spacing.sm,
  },
  syntaxItem: {
    marginBottom: spacing.sm,
    gap: 4,
  },
  syntaxCode: {
    fontFamily: 'monospace',
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  bullet: {
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
});
