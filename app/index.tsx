import { useIsAuthenticated } from '@flux/auth-hooks';
import type { AuthUser } from '@flux/auth-store';
import { initializeAuth } from '@flux/auth-store';
import { kv } from '@storage/index';
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
      const hasOnboarded = kv.getBoolean('onboarding_completed') ?? false;

      if (!hasOnboarded) {
        router.replace('/onboarding');
        return;
      }

      const accessToken = kv.getString('auth_access_token');
      const refreshToken = kv.getString('auth_refresh_token');
      const user = kv.getObject<AuthUser>('auth_user');

      if (accessToken && refreshToken && user) {
        initializeAuth(accessToken, refreshToken, user);
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
