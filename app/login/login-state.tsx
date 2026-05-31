import { useAuth } from '@flux';
import { useCallback, useState } from 'react';

export type LoginStep = 'method' | 'email' | 'otp';

export function useLoginState() {
  const auth = useAuth();
  const [step, setStep] = useState<LoginStep>('method');

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
    setStep('method');
  }, []);

  return {
    step,
    setStep,
    requestOtp,
    verifyOtp,
    resetFlow,
    isLoading: auth.isLoading,
    error: auth.error,
    loginWithApple: auth.loginWithApple,
  };
}
