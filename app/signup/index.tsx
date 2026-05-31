import { Text } from '@ui/text/text';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSignupState } from './signup-state';
import { RegisterScreenContent } from './signup-ui';

export default function RegisterScreen() {
  const router = useRouter();
  useSignupState();

  const handleRegisterSuccess = () => {
    router.replace('/home');
  };

  const handleAlreadyHaveAccount = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <RegisterScreenContent onSuccess={handleRegisterSuccess} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={handleAlreadyHaveAccount}>
            Sign In
          </Text>
        </Text>
      </View>
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
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#007AFF',
    fontWeight: '500',
  },
});
