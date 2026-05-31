import { kv } from '@storage/index';
import { Button } from '@ui/button/button';
import { Text } from '@ui/text/text';
import { Colors, Spacing, useThemeColor } from '@ui/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const primaryColor = useThemeColor({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });

  const handleGetStarted = () => {
    kv.setBoolean('onboarding_completed', true);
    router.replace('/login');
  };

  const handleSkip = () => {
    kv.setBoolean('onboarding_completed', true);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Slate</Text>
        <Text style={styles.subtitle}>
          Your AI-powered learning companion that adapts to your learning style.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View
              style={[styles.featureIcon, { backgroundColor: primaryColor }]}
            >
              <Text style={styles.featureEmoji}>🤖</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI Tutors</Text>
              <Text style={styles.featureDescription}>
                Get personalized help from AI teachers
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View
              style={[styles.featureIcon, { backgroundColor: primaryColor }]}
            >
              <Text style={styles.featureEmoji}>📚</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Adaptive Learning</Text>
              <Text style={styles.featureDescription}>
                Content that matches your pace
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View
              style={[styles.featureIcon, { backgroundColor: primaryColor }]}
            >
              <Text style={styles.featureEmoji}>🎯</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Track Progress</Text>
              <Text style={styles.featureDescription}>
                Monitor your learning journey
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button onPress={handleGetStarted} size="lg">
          Get Started
        </Button>
        <Button onPress={handleSkip} variant="text" size="md">
          Skip for now
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: Spacing[6],
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing[4],
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: Spacing[8],
    lineHeight: 24,
  },
  features: {
    gap: Spacing[6],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: Spacing[6],
    gap: Spacing[4],
  },
});
