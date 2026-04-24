import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
  type ViewProps,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastProps extends ViewProps {
  visible?: boolean;
  message: string;
  type?: ToastType;
  closable?: boolean;
  actions?: ToastAction[];
  autoDismiss?: number;
  onDismiss?: () => void;
}

interface ToastConfig {
  message: string;
  type: ToastType;
  closable: boolean;
  actions?: ToastAction[];
  autoDismiss?: number;
}

interface ToastContextValue {
  showToast: (config: ToastConfig) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((config: ToastConfig) => {
    setToast(config);
    setIsVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isVisible && toast?.autoDismiss) {
      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, toast.autoDismiss);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, toast?.autoDismiss, hideToast]);

  useEffect(() => {
    if (!isVisible && toast) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setToast(null);
    }
  }, [isVisible, toast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        visible={isVisible}
        message={toast?.message ?? ''}
        type={toast?.type ?? 'info'}
        closable={toast?.closable ?? true}
        actions={toast?.actions}
        onDismiss={hideToast}
      />
    </ToastContext.Provider>
  );
}

const TYPE_CONFIG: Record<
  ToastType,
  { icon: string; backgroundColor: { light: string; dark: string } }
> = {
  info: {
    icon: 'ℹ️',
    backgroundColor: {
      light: Colors.light.primary,
      dark: Colors.dark.primary,
    },
  },
  success: {
    icon: '✅',
    backgroundColor: {
      light: '#22c55e',
      dark: '#22c55e',
    },
  },
  warning: {
    icon: '⚠️',
    backgroundColor: {
      light: '#f59e0b',
      dark: '#f59e0b',
    },
  },
  error: {
    icon: '❌',
    backgroundColor: {
      light: Colors.light.destructive,
      dark: Colors.dark.destructive,
    },
  },
};

export function Toast({
  visible = false,
  message,
  type = 'info',
  closable = false,
  actions,
  autoDismiss,
  onDismiss,
  style,
  ...props
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(visible);
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    setIsVisible(visible);
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  useEffect(() => {
    if (visible && autoDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [visible, autoDismiss]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  const typeConfig = TYPE_CONFIG[type];
  const bgColor = useThemeColor(typeConfig.backgroundColor);

  if (!isVisible && !visible) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: bgColor, opacity }, style]}
      {...props}
    >
      <Text style={styles.icon}>{typeConfig.icon}</Text>
      <Text style={styles.message} numberOfLines={3}>
        {message}
      </Text>
      {actions && actions.length > 0 && (
        <View style={styles.actionsContainer}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              style={styles.action}
              onPress={action.onPress}
            >
              <Text style={styles.actionText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {closable && (
        <Pressable style={styles.closeButton} onPress={handleDismiss}>
          <Text style={styles.closeIcon}>×</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Spacing[6],
    left: Spacing[4],
    right: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: Radius.lg,
    gap: Spacing[2],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: FontSizes.xl,
  },
  message: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: '#ffffff',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  action: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionText: {
    fontSize: FontSizes.sm,
    color: '#ffffff',
    fontWeight: '600',
  },
  closeButton: {
    padding: Spacing[1],
  },
  closeIcon: {
    fontSize: FontSizes.xl,
    color: '#ffffff',
    fontWeight: '300',
  },
});
