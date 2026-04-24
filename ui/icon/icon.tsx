import { StyleSheet, Text, type TextProps } from 'react-native';
import { Colors, FontSizes, useThemeColor } from '../theme';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export type IconColor =
  | 'primary'
  | 'muted'
  | 'destructive'
  | 'accent'
  | 'secondary';

export interface IconProps extends Omit<TextProps, 'style'> {
  icon: string;
  size?: IconSize;
  color?: IconColor;
  rotation?: number;
}

const SIZE_MAP: Record<IconSize, number> = {
  sm: FontSizes.base,
  md: FontSizes.xl,
  lg: FontSizes['2xl'],
  xl: FontSizes['4xl'],
};

const COLOR_MAP: Record<IconColor, { light: string; dark: string }> = {
  primary: {
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  },
  muted: {
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  },
  destructive: {
    light: Colors.light.destructive,
    dark: Colors.dark.destructive,
  },
  accent: {
    light: Colors.light.accentForeground,
    dark: Colors.dark.accentForeground,
  },
  secondary: {
    light: Colors.light.secondaryForeground,
    dark: Colors.dark.secondaryForeground,
  },
};

export function Icon({
  icon,
  size = 'md',
  color = 'primary',
  rotation,
  ...props
}: IconProps) {
  const fontSize = SIZE_MAP[size];
  const colorValue = useThemeColor(COLOR_MAP[color]);

  const rotationStyle = rotation
    ? { transform: [{ rotate: `${rotation}deg` }] }
    : undefined;

  return (
    <Text
      style={[styles.icon, { fontSize, color: colorValue }, rotationStyle]}
      {...props}
    >
      {icon}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
