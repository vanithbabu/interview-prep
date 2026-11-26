import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { LiquidCard } from '@/components/ui/LiquidCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { radius, spacing } from '@/theme/spacing';

export default function AuthScreen() {
  const { theme } = useAppTheme();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <ScrollView
          contentContainerStyle={styles.centerContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrap}>
          <View style={styles.brandHeader}>
            <View
              style={[
                styles.logoBadge,
                {
                  backgroundColor: theme.colors.primaryContainer,
                  borderColor: `${theme.colors.primary}40`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="code-braces-box"
                size={44}
                color={theme.colors.primary}
              />
            </View>
            <Text
              variant="headlineMedium"
              style={{ color: theme.colors.onBackground, fontWeight: '800', marginTop: spacing.md }}
            >
              Interview Prep
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 4 }}
            >
              Sign in to continue your learning journey
            </Text>
          </View>

          <LiquidCard style={styles.card}>
            {error ? <ErrorBanner message={error} /> : null}

            <TextInput
              mode="outlined"
              label="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              left={<TextInput.Icon icon="email-outline" />}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onPress={() => setShowPassword((v) => !v)}
                />
              }
              style={styles.input}
            />

            <Button
              mode="contained"
              loading={loading}
              disabled={loading}
              contentStyle={styles.buttonContent}
              style={styles.submitBtn}
              onPress={handleSubmit}
            >
              Sign In
            </Button>
          </LiquidCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  centerContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 420,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  submitBtn: {
    marginTop: spacing.xs,
    borderRadius: radius.md,
  },
  buttonContent: {
    height: 48,
  },
});
