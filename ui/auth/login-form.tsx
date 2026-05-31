import { useAuth } from '@flux';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../button/button';
import { TextInput } from '../text-input/text-input';
import { Text } from '../text/text';
import { Colors, Spacing, useThemeColor } from '../theme';

interface LoginFormProps {
  onSuccess?: () => void;
}

type AuthStep = 'email' | 'otp' | 'method';

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { requestEmailOtp, verifyEmailOtp, isLoading, error } = useAuth();
  const [step, setStep] = useState<AuthStep>('method');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const destructiveColor = useThemeColor({
    light: Colors.light.destructive,
    dark: Colors.dark.destructive,
  });

  const validateEmail = (): boolean => {
    setEmailError('');
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleRequestOtp = async () => {
    if (!validateEmail()) return;
    setGeneralError('');
    try {
      await requestEmailOtp(email);
      setStep('otp');
    } catch (e) {
      setGeneralError(e instanceof Error ? e.message : 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError('');
    setGeneralError('');
    if (!otp || otp.length < 4) {
      setOtpError('Enter the OTP code');
      return;
    }
    try {
      await verifyEmailOtp(email, otp);
      onSuccess?.();
    } catch (e) {
      setGeneralError(
        e instanceof Error ? e.message : 'OTP verification failed'
      );
    }
  };

  const handleReset = () => {
    setStep('method');
    setOtp('');
    setGeneralError('');
    setOtpError('');
  };

  if (step === 'otp') {
    return (
      <View style={styles.container}>
        <Text style={styles.instruction}>Enter the OTP sent to {email}</Text>

        <TextInput
          label="OTP Code"
          value={otp}
          onChangeText={setOtp}
          placeholder="Enter 6-digit code"
          keyboardType="number-pad"
          maxLength={6}
          error={otpError}
        />

        {generalError && (
          <Text style={[styles.error, { color: destructiveColor }]}>
            {generalError}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Button onPress={handleVerifyOtp} loading={isLoading}>
            Sign In
          </Button>
        </View>

        <Button onPress={handleReset} variant="text" disabled={isLoading}>
          Use a different email
        </Button>
      </View>
    );
  }

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

      {generalError && (
        <Text style={[styles.error, { color: destructiveColor }]}>
          {generalError}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button onPress={handleRequestOtp} loading={isLoading}>
          Send OTP
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing[4],
  },
  instruction: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  error: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: Spacing[2],
  },
});
