import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { LiquidCard } from '@/components/ui/LiquidCard';
import { LiquidProgressBar } from '@/components/ui/LiquidProgressBar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme/spacing';
import type { CategoryMeta } from '@/types/content';

interface CategoryCardProps {
  category: CategoryMeta;
  completedCount: number;
  onPress: () => void;
  compact?: boolean;
}

export const CategoryCard = React.memo(function CategoryCard({
  category,
  completedCount,
  onPress,
  compact = false,
}: CategoryCardProps) {
  const { theme } = useAppTheme();
  const total = category.topics.length;
  const progress = total > 0 ? completedCount / total : 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${completedCount} of ${total} topics completed`}
      style={({ pressed }) => [
        compact ? styles.compactWrapper : styles.fullWrapper,
        pressed && { opacity: 0.85 },
      ]}
    >
      <LiquidCard
        accentColor={compact ? undefined : category.accentColor}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={[styles.iconBadge, { backgroundColor: `${category.accentColor}20` }]}>
            <MaterialCommunityIcons
              name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={22}
              color={category.accentColor}
            />
          </View>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {completedCount}/{total} topics
          </Text>
        </View>

        <Text
          variant={compact ? 'titleSmall' : 'titleMedium'}
          numberOfLines={1}
          style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: spacing.sm }}
        >
          {category.name}
        </Text>

        {!compact ? (
          <Text
            variant="bodySmall"
            numberOfLines={2}
            style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}
          >
            {category.shortDescription}
          </Text>
        ) : null}

        <View style={styles.barWrap}>
          <LiquidProgressBar
            progress={progress}
            color={category.accentColor}
            height={6}
          />
        </View>
      </LiquidCard>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  fullWrapper: {
    width: '100%',
  },
  compactWrapper: {
    width: '48.5%',
  },
  card: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barWrap: {
    marginTop: spacing.md,
  },
});
