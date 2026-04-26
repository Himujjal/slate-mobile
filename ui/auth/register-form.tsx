import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../flux/auth-hooks';
import { Button } from '../button/button';
import { TextInput } from '../text-input/text-input';
import { Text } from '../text/text';
import { Colors, Spacing, useThemeColor } from '../theme';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, isLoading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const destructiveColor = useThemeColor({
    light: Colors.light.destructive,
    dark: Colors.dark.destructive,
  });

  const validate = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setGeneralError('');

    if (!name || name.length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    }

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
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await register({ email, password, name });
      onSuccess?.();
    } catch (e) {
      setGeneralError(e instanceof Error ? e.message : 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        autoCapitalize="words"
        error={nameError}
      />

      <View style={styles.spacer} />

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
        placeholder="Min 8 characters"
        secureTextEntry
        error={passwordError}
      />

      <View style={styles.spacer} />

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Repeat password"
        secureTextEntry
        error={confirmError}
      />

      {generalError && (
        <Text style={[styles.error, { color: destructiveColor }]}>
          {generalError}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button onPress={handleSubmit} loading={isLoading}>
          Create Account
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
