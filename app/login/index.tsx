import { Text } from '@ui/text/text';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useLoginState } from './login-state';
import { LoginScreenContent } from './login-ui';

export default function LoginScreen() {
  const router = useRouter();
  useLoginState();

  const handleLoginSuccess = () => {
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <LoginScreenContent onSuccess={handleLoginSuccess} />
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
