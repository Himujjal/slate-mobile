import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
  View,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

export type BadgeVariant = 'filled' | 'outlined';
export type BadgeColor = 'primary' | 'secondary' | 'destructive' | 'muted';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends TextProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  style?: TextStyle;
}

export function Badge({
  variant = 'filled',
  color = 'primary',
  size = 'md',
  children,
  style,
  ...props
}: BadgeProps) {
  const primary = useThemeColor({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });
  const primaryForeground = useThemeColor({
    light: Colors.light.primaryForeground,
    dark: Colors.dark.primaryForeground,
  });
  const secondary = useThemeColor({
    light: Colors.light.secondary,
    dark: Colors.dark.secondary,
  });
  const secondaryForeground = useThemeColor({
    light: Colors.light.secondaryForeground,
    dark: Colors.dark.secondaryForeground,
  });
  const destructive = useThemeColor({
    light: Colors.light.destructive,
    dark: Colors.dark.destructive,
  });
  const destructiveForeground = useThemeColor({
    light: Colors.light.destructiveForeground,
    dark: Colors.dark.destructiveForeground,
  });
  const muted = useThemeColor({
    light: Colors.light.muted,
    dark: Colors.dark.muted,
  });
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const border = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });

  const containerStyle = useMemo(() => {
    const sizeStyles = {
      sm: {
        paddingHorizontal: Spacing[2],
        paddingVertical: Spacing[0],
      },
      md: {
        paddingHorizontal: Spacing[2],
        paddingVertical: Spacing[1],
      },
    };

    const variantStyles = {
      filled: {
        primary: { backgroundColor: primary, borderWidth: 0 },
        secondary: { backgroundColor: secondary, borderWidth: 0 },
        destructive: { backgroundColor: destructive, borderWidth: 0 },
        muted: { backgroundColor: muted, borderWidth: 0 },
      },
      outlined: {
        primary: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: primary,
        },
        secondary: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: border,
        },
        destructive: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: destructive,
        },
        muted: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: border,
        },
      },
    };

    const textColors = {
      filled: {
        primary: primaryForeground,
        secondary: secondaryForeground,
        destructive: destructiveForeground,
        muted: mutedFg,
      },
      outlined: {
        primary: primary,
        secondary: secondaryForeground,
        destructive: destructive,
        muted: mutedFg,
      },
    };

    const fontSize = size === 'sm' ? FontSizes.xs : FontSizes.sm;

    return StyleSheet.create({
      container: {
        ...sizeStyles[size],
        borderRadius: Radius.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...variantStyles[variant][color],
      },
      text: {
        fontWeight: '600',
        fontSize,
        color: textColors[variant][color],
      },
    });
  }, [
    variant,
    color,
    size,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    destructive,
    destructiveForeground,
    muted,
    mutedFg,
    border,
  ]);

  return (
    <View style={containerStyle.container}>
      <Text style={[containerStyle.text, style]} {...props}>
        {children}
      </Text>
    </View>
  );
}
