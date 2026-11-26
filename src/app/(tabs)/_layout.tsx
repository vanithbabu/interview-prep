import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius } from '@/theme/spacing';

function TabIcon({
  name,
  color,
  focused,
  activeBg,
  fallbackColor,
}: {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  color: unknown;
  focused: boolean;
  activeBg: string;
  fallbackColor: string;
}) {
  return (
    <View style={[styles.iconPill, focused && { backgroundColor: activeBg }]}>
      <MaterialCommunityIcons
        name={name}
        size={21}
        color={typeof color === 'string' ? color : fallbackColor}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarAccessibilityLabel: 'Dashboard tab',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="view-dashboard-outline"
              color={color}
              focused={focused}
              activeBg={theme.colors.primaryContainer}
              fallbackColor={theme.colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Courses',
          tabBarAccessibilityLabel: 'Courses tab',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="shape-outline"
              color={color}
              focused={focused}
              activeBg={theme.colors.primaryContainer}
              fallbackColor={theme.colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarAccessibilityLabel: 'Search and bookmarks tab',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="magnify"
              color={color}
              focused={focused}
              activeBg={theme.colors.primaryContainer}
              fallbackColor={theme.colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="interview"
        options={{
          title: 'Interview',
          tabBarAccessibilityLabel: 'Mock interview and AI coach tab',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="microphone-outline"
              color={color}
              focused={focused}
              activeBg={theme.colors.primaryContainer}
              fallbackColor={theme.colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarAccessibilityLabel: 'Learning progress tab',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="chart-line"
              color={color}
              focused={focused}
              activeBg={theme.colors.primaryContainer}
              fallbackColor={theme.colors.primary}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
