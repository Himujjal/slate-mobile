import { type Href, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuthLoading, useIsAuthenticated } from '../../flux/auth-hooks';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: Href;
}

export function ProtectedRoute({
  children,
  fallback = '/login' as Href,
}: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View />
      </View>
    );
  }

  if (!isAuthenticated) {
    router.replace(fallback);
    return (
      <View style={styles.container}>
        <View />
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
