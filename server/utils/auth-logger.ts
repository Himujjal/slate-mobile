type LogLevel = 'info' | 'warn' | 'error';

interface AuthEvent {
  timestamp: number;
  level: LogLevel;
  event: string;
  email?: string;
  ip?: string;
  details?: string;
}

const authLogBuffer: AuthEvent[] = [];
const MAX_LOG_BUFFER_SIZE = 1000;

function logAuthEvent(
  event: string,
  level: LogLevel = 'info',
  data?: { email?: string; ip?: string; details?: string }
) {
  const entry: AuthEvent = {
    timestamp: Date.now(),
    level,
    event,
    email: data?.email,
    ip: data?.ip,
    details: data?.details,
  };

  authLogBuffer.push(entry);
  if (authLogBuffer.length > MAX_LOG_BUFFER_SIZE) {
    authLogBuffer.shift();
  }

  if (process.env.NODE_ENV !== 'test') {
    const prefix =
      level === 'error' ? '[ERROR]' : level === 'warn' ? '[WARN]' : '[INFO]';
    console.log(
      `${prefix} [AUTH] ${event}${data?.email ? ` (${data.email})` : ''}${data?.details ? `: ${data.details}` : ''}`
    );
  }
}

export function logLoginAttempt(email: string, success: boolean, ip?: string) {
  logAuthEvent(
    success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
    success ? 'info' : 'warn',
    {
      email,
      ip,
      details: success ? 'Login successful' : 'Invalid credentials',
    }
  );
}

export function logRegisterAttempt(
  email: string,
  success: boolean,
  ip?: string
) {
  logAuthEvent(
    success ? 'REGISTER_SUCCESS' : 'REGISTER_FAILED',
    success ? 'info' : 'warn',
    {
      email,
      ip,
      details: success ? 'Registration successful' : 'Failed registration',
    }
  );
}

export function logLockout(email: string, ip?: string) {
  logAuthEvent('ACCOUNT_LOCKOUT', 'warn', {
    email,
    ip,
    details: 'Account locked due to failed attempts',
  });
}

export function logAuthEvents(): AuthEvent[] {
  return [...authLogBuffer];
}
