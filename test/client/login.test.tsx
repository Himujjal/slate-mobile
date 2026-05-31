import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { act, render, renderHook } from '@testing-library/react';
import React from 'react';

interface UseAuthMock {
  requestEmailOtp: (email: string) => Promise<unknown>;
  verifyEmailOtp: (email: string, otp: string) => Promise<unknown>;
  loginWithApple: (idToken: string) => Promise<unknown>;
  isLoading: boolean;
  error: string | null;
}

function createMockAuth(overrides: Partial<UseAuthMock> = {}): UseAuthMock {
  return {
    requestEmailOtp: async () => ({}),
    verifyEmailOtp: async () => ({}),
    loginWithApple: async () => ({}),
    isLoading: false,
    error: null,
    ...overrides,
  };
}

let mockAuth = createMockAuth();

mock.module('@flux', () => ({
  useAuth: () => mockAuth,
}));

mock.module('@ui/auth/login-form', () => ({
  LoginForm: React.forwardRef(
    (_props: { onSuccess?: () => void }, _ref: unknown) => {
      return React.createElement('div', { 'data-testid': 'login-form' });
    }
  ),
}));

import { useLoginState } from '../../app/login/login-state';
import { LoginScreenContent } from '../../app/login/login-ui';

describe('useLoginState', () => {
  beforeEach(() => {
    mockAuth = createMockAuth();
  });

  it('should start at the method step', () => {
    const { result } = renderHook(() => useLoginState());
    expect(result.current.step).toBe('method');
  });

  it('should allow changing step directly', () => {
    const { result } = renderHook(() => useLoginState());

    act(() => {
      result.current.setStep('email');
    });
    expect(result.current.step).toBe('email');

    act(() => {
      result.current.setStep('otp');
    });
    expect(result.current.step).toBe('otp');
  });

  it('should reset step to method on resetFlow', () => {
    const { result } = renderHook(() => useLoginState());

    act(() => {
      result.current.setStep('otp');
    });
    expect(result.current.step).toBe('otp');

    act(() => {
      result.current.resetFlow();
    });
    expect(result.current.step).toBe('method');
  });

  it('should reflect isLoading from auth', () => {
    mockAuth.isLoading = true;
    const { result } = renderHook(() => useLoginState());
    expect(result.current.isLoading).toBe(true);
  });

  it('should reflect error from auth', () => {
    mockAuth.error = 'Something went wrong';
    const { result } = renderHook(() => useLoginState());
    expect(result.current.error).toBe('Something went wrong');
  });

  it('should expose loginWithApple from auth', () => {
    const appleFn = async (_idToken: string) => {};
    mockAuth.loginWithApple = appleFn;

    const { result } = renderHook(() => useLoginState());
    expect(result.current.loginWithApple).toBe(appleFn);
  });

  it('should call auth.requestEmailOtp and move to otp step on requestOtp', async () => {
    let calledWith = '';
    mockAuth.requestEmailOtp = async (email: string) => {
      calledWith = email;
    };

    const { result } = renderHook(() => useLoginState());

    await act(async () => {
      await result.current.requestOtp('test@example.com');
    });

    expect(calledWith).toBe('test@example.com');
    expect(result.current.step).toBe('otp');
  });

  it('should call auth.verifyEmailOtp on verifyOtp', async () => {
    let captured = { email: '', otp: '' };
    mockAuth.verifyEmailOtp = async (email: string, otp: string) => {
      captured = { email, otp };
    };

    const { result } = renderHook(() => useLoginState());

    await act(async () => {
      await result.current.verifyOtp('test@example.com', '123456');
    });

    expect(captured.email).toBe('test@example.com');
    expect(captured.otp).toBe('123456');
  });

  it('should propagate errors from requestOtp', async () => {
    mockAuth.requestEmailOtp = async () => {
      throw new Error('Network error');
    };

    const { result } = renderHook(() => useLoginState());

    let caught: Error | null = null;
    await act(async () => {
      try {
        await result.current.requestOtp('test@example.com');
      } catch (e) {
        caught = e as Error;
      }
    });

    expect((caught as Error | null)?.message).toBe('Network error');
  });
});

describe('LoginScreenContent', () => {
  it('should render without crashing', () => {
    const { container } = render(<LoginScreenContent />);
    expect(container).toBeDefined();
  });

  it('should render the login form', () => {
    const { getByTestId } = render(<LoginScreenContent />);
    expect(getByTestId('login-form')).toBeDefined();
  });
});
