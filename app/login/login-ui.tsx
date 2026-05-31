import { LoginForm } from '@ui/auth/login-form';

interface LoginScreenContentProps {
  onSuccess?: () => void;
}

export function LoginScreenContent({ onSuccess }: LoginScreenContentProps) {
  return <LoginForm onSuccess={onSuccess} />;
}
