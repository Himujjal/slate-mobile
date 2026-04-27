import { useAuth } from '@flux/auth-hooks';
import { Button } from '@ui/button/button';
import { Text } from '@ui/text/text';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.welcome}>Welcome, {user?.name || 'User'}!</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.content}>
        <Text>Your learning dashboard will appear here.</Text>
      </View>

      <Button onPress={handleLogout} variant="outlined">
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
