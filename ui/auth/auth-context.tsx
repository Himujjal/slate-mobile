import { useAuth } from '@flux';
import type { AuthUser } from '@flux/auth-store';
import { type ReactNode, createContext, useContext } from 'react';

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  requestEmailOtp: (email: string) => Promise<{
    message: string;
    identifier: string;
    method: 'email' | 'mobile';
  }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<void>;
  requestMobileOtp: (phone: string) => Promise<{
    message: string;
    identifier: string;
    method: 'email' | 'mobile';
  }>;
  verifyMobileOtp: (phone: string, otp: string) => Promise<void>;
  loginWithApple: (idToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
