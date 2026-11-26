import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { CategoryCard } from '@/features/categories/CategoryCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useContentStore } from '@/store/useContentStore';
import { useProgressStore } from '@/store/useProgressStore';
import { spacing } from '@/theme/spacing';

export default function CategoriesScreen() {
  const { theme } = useAppTheme();
  const categories = useContentStore((s) => s.categories);
  const completedTopicIds = useProgressStore((s) => s.completedTopicIds);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, fontWeight: '800' }}>
          Technologies
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          6 core technologies with Beginner-to-Advanced interview roadmaps.
        </Text>
      </View>

      <View style={styles.list}>
        {categories.map((category) => {
          const completedInCat = category.topics.filter((t) =>
            completedTopicIds.includes(t.id)
          ).length;
          return (
            <CategoryCard
              key={category.id}
              category={category}
              completedCount={completedInCat}
              onPress={() => router.push(`/category/${category.id}`)}
            />
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  list: {
    gap: spacing.md,
  },
});
