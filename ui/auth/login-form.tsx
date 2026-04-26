import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../flux/auth-hooks';
import { Button } from '../button/button';
import { TextInput } from '../text-input/text-input';
import { Text } from '../text/text';
import { Colors, Spacing, useThemeColor } from '../theme';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const destructiveColor = useThemeColor({
    light: Colors.light.destructive,
    dark: Colors.dark.destructive,
  });

  const validate = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await login({ email, password });
      onSuccess?.();
    } catch (e) {
      setGeneralError(e instanceof Error ? e.message : 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={emailError}
      />

      <View style={styles.spacer} />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        error={passwordError}
      />

      {generalError && (
        <Text style={[styles.error, { color: destructiveColor }]}>
          {generalError}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button onPress={handleSubmit} loading={isLoading}>
          Sign In
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing[4],
  },
  spacer: {
    height: Spacing[4],
  },
  error: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: Spacing[4],
  },
});
