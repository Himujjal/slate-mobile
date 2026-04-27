import { useIsAuthenticated } from '@flux/auth-hooks';
import { initializeAuth } from '@flux/auth-store';
import { onboardingStorage, tokenStorage } from '@storage/index';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeAndRoute = async () => {
      const hasOnboarded = onboardingStorage.hasOnboarded();

      if (!hasOnboarded) {
        router.replace('/onboarding');
        return;
      }

      const tokens = tokenStorage.getTokens();
      const user = tokenStorage.getUser();

      if (tokens && user) {
        initializeAuth(tokens.accessToken, tokens.refreshToken, user);
      }

      if (isAuthenticated) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    };

    initializeAndRoute();
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
