import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,
        animation: 'none',
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          height: 68 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 6,
        },
        tabBarIconStyle: {
          width: 52,
          height: 30,
          marginBottom: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarButton: ({
          children,
          style,
          onPress,
          onLongPress,
          accessibilityLabel,
          accessibilityState,
          testID,
        }) => (
          <Pressable
            onPress={onPress ?? undefined}
            onLongPress={onLongPress ?? undefined}
            accessibilityLabel={accessibilityLabel}
            accessibilityState={accessibilityState}
            testID={testID}
            android_ripple={{ color: 'transparent' }}
            style={({ pressed }) => [
              style,
              pressed && { opacity: 0.72, transform: [{ scale: 0.96 }] },
            ]}
          >
            {children}
          </Pressable>
        ),
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
    width: 48,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
