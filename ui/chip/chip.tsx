import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

export type ChipVariant = 'filled' | 'outlined';
export type ChipSize = 'sm' | 'md';

export interface ChipProps extends Omit<ViewProps, 'style'> {
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  closable?: boolean;
  onClose?: () => void;
  onPress?: () => void;
  children: ReactNode;
}

const sizeStyles: Record<ChipSize, object> = {
  sm: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
    borderRadius: Radius.sm,
  },
  md: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.md,
  },
};

const textSizes: Record<ChipSize, number> = {
  sm: FontSizes.xs,
  md: FontSizes.sm,
};

export function Chip({
  variant = 'filled',
  size = 'md',
  selected = false,
  closable = false,
  onClose,
  onPress,
  children,
  ...props
}: ChipProps) {
  const backgroundColor = useThemeColor({
    light:
      variant === 'filled'
        ? selected
          ? Colors.light.primary
          : Colors.light.secondary
        : selected
          ? Colors.light.primary
          : 'transparent',
    dark:
      variant === 'filled'
        ? selected
          ? Colors.dark.primary
          : Colors.dark.secondary
        : selected
          ? Colors.dark.primary
          : 'transparent',
  });

  const foregroundColor = useThemeColor({
    light:
      variant === 'filled'
        ? selected
          ? Colors.light.primaryForeground
          : Colors.light.secondaryForeground
        : selected
          ? Colors.light.primaryForeground
          : Colors.light.foreground,
    dark:
      variant === 'filled'
        ? selected
          ? Colors.dark.primaryForeground
          : Colors.dark.secondaryForeground
        : selected
          ? Colors.dark.primaryForeground
          : Colors.dark.foreground,
  });

  const borderColor = useThemeColor({
    light:
      variant === 'outlined'
        ? selected
          ? Colors.light.primary
          : Colors.light.border
        : 'transparent',
    dark:
      variant === 'outlined'
        ? selected
          ? Colors.dark.primary
          : Colors.dark.border
        : 'transparent',
  });

  const borderWidth = variant === 'outlined' ? 1 : 0;

  const handleClose = () => {
    onClose?.();
  };

  const content = (
    <View style={styles.content}>
      <Text
        style={[
          styles.text,
          {
            fontSize: textSizes[size],
            color: foregroundColor,
          },
        ]}
      >
        {children}
      </Text>
      {closable && (
        <Pressable onPress={handleClose} hitSlop={4} style={styles.closeButton}>
          <Text style={[styles.closeIcon, { color: foregroundColor }]}>×</Text>
        </Pressable>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        style={[
          styles.base,
          sizeStyles[size],
          {
            backgroundColor,
            borderWidth,
            borderColor,
          },
        ]}
        onPress={onPress}
        {...props}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.base,
        sizeStyles[size],
        {
          backgroundColor,
          borderWidth,
          borderColor,
        },
      ]}
      {...props}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  text: {
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: Spacing[1],
  },
  closeIcon: {
    fontSize: FontSizes.lg,
    fontWeight: '400',
    lineHeight: FontSizes.lg,
  },
});
