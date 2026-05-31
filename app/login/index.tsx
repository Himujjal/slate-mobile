import { LoginForm } from '@ui/auth/login-form';
import { Text } from '@ui/text/text';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <LoginForm onSuccess={handleLoginSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});
