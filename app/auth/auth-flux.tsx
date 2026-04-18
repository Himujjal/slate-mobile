import { useRouter, useSegments } from 'expo-router';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string } | null;
};

type AuthContextType = AuthState & {
  signIn: (email: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function useAuthProvider() {
  const router = useRouter();
  const segments = useSegments();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const stored = await getStoredAuth();
      setState({
        isAuthenticated: stored.isAuthenticated,
        isLoading: false,
        user: stored.user,
      });
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const isAuthRoute = segments[0] === 'auth';
    const isTabRoute = segments[0] === '(tabs)';

    if (!state.isLoading) {
      if (!state.isAuthenticated && isTabRoute) {
        router.replace('/auth');
      } else if (state.isAuthenticated && isAuthRoute) {
        router.replace('/(tabs)');
      }
    }
  }, [state.isAuthenticated, state.isLoading, segments, router]);

  const signIn = async (email: string) => {
    const user = { id: '1', email };
    await storeAuth({ isAuthenticated: true, user });
    setState({ isAuthenticated: true, isLoading: false, user });
  };

  const signOut = async () => {
    await clearAuth();
    setState({ isAuthenticated: false, isLoading: false, user: null });
  };

  return { ...state, signIn, signOut };
}

async function getStoredAuth(): Promise<{
  isAuthenticated: boolean;
  user: { id: string; email: string } | null;
}> {
  return { isAuthenticated: false, user: null };
}

async function storeAuth(data: {
  isAuthenticated: boolean;
  user: { id: string; email: string } | null;
}): Promise<void> {}

async function clearAuth(): Promise<void> {}

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
