import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, IconButton, Surface, Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';
import { runSandboxedJavaScript } from '@/services/codeRunnerService';
import { useThemeStore } from '@/store/useThemeStore';
import { radius, spacing } from '@/theme/spacing';

interface CodeBlockProps {
  code: string;
  language?: string;
  expectedOutput?: string;
  showOutput?: boolean;
  allowRun?: boolean;
}

export function CodeBlock({
  code,
  language = 'JavaScript',
  expectedOutput,
  showOutput = true,
  allowRun = true,
}: CodeBlockProps) {
  const { theme } = useAppTheme();
  const hapticsEnabled = useThemeStore((s) => s.hapticsEnabled);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isJsRunnable =
    allowRun && (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js');

  const handleRun = () => {
    const res = runSandboxedJavaScript(code);
    setRunOutput(res.output);
    setRunError(res.error ?? null);
  };

  const handleCopy = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(code);
    }
    if (hapticsEnabled && Platform.OS !== 'web') {
      await Haptics.selectionAsync();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.wrapper}>
      <Surface
        elevation={0}
        style={[
          styles.codeSurface,
          { backgroundColor: '#1E2127', borderColor: theme.colors.outline },
        ]}
      >
        <View style={styles.headerBar}>
          <View style={styles.langRow}>
            <MaterialCommunityIcons name="code-tags" size={16} color="#9CA3AF" />
            <Text variant="labelMedium" style={styles.langText}>
              {language}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {isJsRunnable ? (
              <Button mode="text" compact textColor="#7C9BFF" icon="play" onPress={handleRun}>
                Run
              </Button>
            ) : null}
            <IconButton
              icon={copied ? 'check' : 'content-copy'}
              size={16}
              iconColor={copied ? '#4ADE80' : '#9CA3AF'}
              onPress={handleCopy}
              accessibilityLabel="Copy code"
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text variant="bodySmall" style={styles.mono}>
            {code}
          </Text>
        </ScrollView>
      </Surface>

      {showOutput && expectedOutput ? (
        <Surface
          elevation={0}
          style={[
            styles.outputSurface,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.outline,
              borderWidth: 1,
            },
          ]}
        >
          <Text variant="labelSmall" style={{ color: theme.colors.secondary, fontWeight: '700' }}>
            EXPECTED OUTPUT
          </Text>
          <Text variant="bodySmall" style={[styles.outputMono, { color: theme.colors.onSurface, marginTop: 4 }]}>
            {expectedOutput}
          </Text>
        </Surface>
      ) : null}

      {runOutput !== null || runError !== null ? (
        <Surface
          elevation={0}
          style={[
            styles.outputSurface,
            {
              backgroundColor: runError ? theme.colors.errorContainer : theme.colors.secondaryContainer,
            },
          ]}
        >
          <Text
            variant="labelSmall"
            style={{
              color: runError ? theme.colors.onErrorContainer : theme.colors.onSecondaryContainer,
              fontWeight: '700',
            }}
          >
            {runError ? 'RUNTIME ERROR' : 'LIVE OUTPUT'}
          </Text>
          <Text
            variant="bodySmall"
            style={[
              styles.outputMono,
              {
                color: runError ? theme.colors.onErrorContainer : theme.colors.onSecondaryContainer,
                marginTop: 4,
              },
            ]}
          >
            {runError ? runError : runOutput}
          </Text>
        </Surface>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  codeSurface: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langText: {
    color: '#D1D5DB',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mono: {
    fontFamily: 'monospace',
    lineHeight: 21,
    color: '#E5E7EB',
  },
  outputMono: {
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  outputSurface: {
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
});
