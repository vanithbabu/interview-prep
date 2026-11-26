import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme/spacing';
import type { DifficultyLevel } from '@/types/content';

interface SearchResultCardProps {
  kind: 'topic' | 'question';
  title: string;
  subtitle: string;
  difficulty: DifficultyLevel;
  isBookmarked?: boolean;
  statusLabel?: 'Got It' | 'Needs Review';
  notePreview?: string;
  onPress: () => void;
}

export const SearchResultCard = React.memo(function SearchResultCard({
  kind,
  title,
  subtitle,
  difficulty,
  isBookmarked = false,
  statusLabel,
  notePreview,
  onPress,
}: SearchResultCardProps) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${kind}: ${title}`}
      style={({ pressed }) => [pressed && { opacity: 0.85 }]}
    >
      <LiquidCard>
        <View style={styles.topRow}>
          <View style={styles.badges}>
            <DifficultyBadge level={difficulty} />
            <View style={[styles.tagPill, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 11 }}>
                {kind === 'topic' ? 'Topic' : 'Q&A'}
              </Text>
            </View>
            {statusLabel ? (
              <View style={[styles.tagPill, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text
                  variant="labelSmall"
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color:
                      statusLabel === 'Got It' ? theme.custom.success : theme.custom.warning,
                  }}
                >
                  {statusLabel}
                </Text>
              </View>
            ) : null}
          </View>
          {isBookmarked ? (
            <MaterialCommunityIcons
              name="bookmark"
              size={20}
              color={theme.colors.primary}
            />
          ) : null}
        </View>

        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: spacing.xs }}
        >
          {title}
        </Text>

        <Text
          variant="bodySmall"
          numberOfLines={2}
          style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}
        >
          {subtitle}
        </Text>

        {notePreview ? (
          <Text
            variant="labelSmall"
            numberOfLines={1}
            style={{ color: theme.colors.secondary, marginTop: spacing.sm }}
          >
            Note: {notePreview}
          </Text>
        ) : null}
      </LiquidCard>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  tagPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
