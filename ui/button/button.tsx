import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

type ButtonVariant = 'filled' | 'outlined' | 'text' | 'ghost';
type ButtonColor = 'primary' | 'secondary' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { borderWidth: number }> = {
  filled: { borderWidth: 0 },
  outlined: { borderWidth: 1 },
  text: { borderWidth: 0 },
  ghost: { borderWidth: 0 },
};

const sizeStyles: Record<ButtonSize, object> = {
  sm: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.md,
  },
  md: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.md,
  },
  lg: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
    borderRadius: Radius.lg,
  },
};

const textSizes: Record<ButtonSize, number> = {
  sm: FontSizes.sm,
  md: FontSizes.base,
  lg: FontSizes.lg,
};

export function Button({
  variant = 'filled',
  color = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const primaryBg = useThemeColor({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });
  const primaryFg = useThemeColor({
    light: Colors.light.primaryForeground,
    dark: Colors.dark.primaryForeground,
  });
  const secondaryBg = useThemeColor({
    light: Colors.light.secondary,
    dark: Colors.dark.secondary,
  });
  const secondaryFg = useThemeColor({
    light: Colors.light.secondaryForeground,
    dark: Colors.dark.secondaryForeground,
  });
  const destructiveBg = useThemeColor({
    light: Colors.light.destructive,
    dark: Colors.dark.destructive,
  });
  const destructiveFg = useThemeColor({
    light: Colors.light.destructiveForeground,
    dark: Colors.dark.destructiveForeground,
  });

  const colorMap: Record<
    ButtonColor,
    { background: string; foreground: string; border: string }
  > = {
    primary: {
      background: primaryBg,
      foreground: primaryFg,
      border: primaryBg,
    },
    secondary: {
      background: secondaryBg,
      foreground: secondaryFg,
      border: secondaryBg,
    },
    destructive: {
      background: destructiveBg,
      foreground: destructiveFg,
      border: destructiveBg,
    },
  };

  const colors = colorMap[color];
  const backgroundColor =
    variant === 'filled' || variant === 'ghost'
      ? colors.background
      : 'transparent';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        {
          backgroundColor,
          borderWidth: variantStyles[variant].borderWidth,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={colors.foreground}
          size={size === 'sm' ? 'small' : 'small'}
        />
      ) : (
        <Text
          style={[
            styles.text,
            { fontSize: textSizes[size], color: colors.foreground },
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '500',
  },
});
