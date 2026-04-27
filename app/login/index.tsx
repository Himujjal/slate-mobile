import { useAuth } from '@flux/auth-hooks';
import { LoginForm } from '@ui/auth/login-form';
import { Text } from '@ui/text/text';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI;

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithGoogle, error } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLoginSuccess = () => {
    router.replace('/home');
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI || 'com.thechalklabs.slate:/oauth2redirect'
      )}&response_type=id_token&scope=openid%20email%20profile&nonce=${crypto.randomUUID()}`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        REDIRECT_URI || 'com.thechalklabs.slate:/oauth2redirect'
      );

      if (result.type === 'success') {
        const url = result.url;
        const idToken = url.match(/id_token=([^&]+)/)?.[1];

        if (idToken) {
          await loginWithGoogle({ idToken });
          handleLoginSuccess();
        }
      }
    } catch (e) {
      console.error('Google sign in error:', e);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <LoginForm
        onSuccess={handleLoginSuccess}
        onGoogleSignIn={handleGoogleSignIn}
      />
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
