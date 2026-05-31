import { RegisterForm } from '@ui/auth/register-form';

interface RegisterScreenContentProps {
  onSuccess?: () => void;
}

export function RegisterScreenContent({
  onSuccess,
}: RegisterScreenContentProps) {
  return <RegisterForm onSuccess={onSuccess} />;
}
