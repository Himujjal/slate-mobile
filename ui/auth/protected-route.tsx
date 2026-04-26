import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsAuthenticated } from '../../flux/auth-hooks';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
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
