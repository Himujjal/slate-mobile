import { useAuth } from '@flux';
import { useCallback, useState } from 'react';

export type SignupStep = 'email' | 'otp';

export function useSignupState() {
  const auth = useAuth();
  const [step, setStep] = useState<SignupStep>('email');

  const requestOtp = useCallback(
    async (emailValue: string) => {
      await auth.requestEmailOtp(emailValue);
      setStep('otp');
    },
    [auth]
  );

  const verifyOtp = useCallback(
    async (emailValue: string, otpValue: string) => {
      await auth.verifyEmailOtp(emailValue, otpValue);
    },
    [auth]
  );

  const resetFlow = useCallback(() => {
    setStep('email');
  }, []);

  return {
    step,
    setStep,
    requestOtp,
    verifyOtp,
    resetFlow,
    isLoading: auth.isLoading,
    error: auth.error,
  };
}
