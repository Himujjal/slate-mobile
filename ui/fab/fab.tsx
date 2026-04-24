import { StyleSheet, Text, type TextProps } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

export type FabSize = 'sm' | 'md' | 'lg';
export type FabColor = 'primary' | 'secondary' | 'destructive';

export interface FabProps extends Omit<TextProps, 'style'> {
  icon?: string;
  label?: string;
  size?: FabSize;
  color?: FabColor;
  onPress?: () => void;
}

const SIZE_MAP: Record<FabSize, number> = {
  sm: Spacing[5],
  md: Spacing[6],
  lg: Spacing[8],
};

const ICON_SIZE_MAP: Record<FabSize, number> = {
  sm: FontSizes.lg,
  md: FontSizes.xl,
  lg: FontSizes['2xl'],
};

const COLOR_MAP: Record<FabColor, { light: string; dark: string }> = {
  primary: {
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  },
  secondary: {
    light: Colors.light.secondary,
    dark: Colors.dark.secondary,
  },
  destructive: {
    light: Colors.light.destructive,
    dark: Colors.dark.destructive,
  },
};

const FOREGROUND_MAP: Record<FabColor, { light: string; dark: string }> = {
  primary: {
    light: Colors.light.primaryForeground,
    dark: Colors.dark.primaryForeground,
  },
  secondary: {
    light: Colors.light.secondaryForeground,
    dark: Colors.dark.secondaryForeground,
  },
  destructive: {
    light: Colors.light.destructiveForeground,
    dark: Colors.dark.destructiveForeground,
  },
};

export function Fab({
  icon,
  label,
  size = 'md',
  color = 'primary',
  onPress,
  ...props
}: FabProps) {
  const isExtended = !!label;
  const bgColor = useThemeColor(COLOR_MAP[color]);
  const fgColor = useThemeColor(FOREGROUND_MAP[color]);
  const fabSize = SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];

  const content = icon ? (
    <Text style={[styles.icon, { fontSize: iconSize, color: fgColor }]}>
      {icon}
    </Text>
  ) : null;

  if (isExtended) {
    return (
      <Text
        style={[
          styles.extended,
          {
            backgroundColor: bgColor,
            paddingVertical: fabSize,
            paddingRight: fabSize,
            paddingLeft: icon ? fabSize : fabSize,
          },
        ]}
        onPress={onPress}
        {...props}
      >
        {content}
        <Text
          style={[
            styles.label,
            { color: fgColor, fontSize: fabSize - Spacing[2] },
          ]}
        >
          {label}
        </Text>
      </Text>
    );
  }

  return (
    <Text
      style={[
        styles.fab,
        {
          backgroundColor: bgColor,
          width: fabSize * 2,
          height: fabSize * 2,
        },
      ]}
      onPress={onPress}
      {...props}
    >
      {content}
    </Text>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  extended: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  icon: {
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginLeft: Spacing[2],
  },
});
