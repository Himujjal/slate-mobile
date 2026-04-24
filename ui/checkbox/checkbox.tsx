import { forwardRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type View,
  type ViewProps,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';
export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<ViewProps, 'onPress'> {
  checked?: CheckboxState;
  onCheckedChange?: (checked: CheckboxState) => void;
  label?: string;
  disabled?: boolean;
  size?: CheckboxSize;
}

const sizeStyles: Record<
  CheckboxSize,
  { boxSize: number; borderWidth: number; iconSize: number }
> = {
  sm: { boxSize: 18, borderWidth: 2, iconSize: 10 },
  md: { boxSize: 22, borderWidth: 2, iconSize: 12 },
  lg: { boxSize: 26, borderWidth: 3, iconSize: 14 },
};

export const Checkbox = forwardRef<View, CheckboxProps>(
  (
    {
      checked = 'unchecked',
      onCheckedChange,
      label,
      disabled = false,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const mutedFg = useThemeColor({
      light: Colors.light.mutedForeground,
      dark: Colors.dark.mutedForeground,
    });
    const primary = useThemeColor({
      light: Colors.light.primary,
      dark: Colors.dark.primary,
    });
    const primaryFg = useThemeColor({
      light: Colors.light.primaryForeground,
      dark: Colors.dark.primaryForeground,
    });

    const handlePress = () => {
      if (disabled) return;
      const nextState: Record<CheckboxState, CheckboxState> = {
        unchecked: 'checked',
        checked: 'unchecked',
        indeterminate: 'checked',
      };
      onCheckedChange?.(nextState[checked]);
    };

    const { boxSize, borderWidth, iconSize } = sizeStyles[size];
    const isChecked = checked === 'checked';
    const isIndeterminate = checked === 'indeterminate';
    const isDisabled = disabled;

    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={isDisabled}
        style={[styles.container, props.style]}
        aria-role="checkbox"
        aria-checked={checked === 'indeterminate' ? 'mixed' : isChecked}
      >
        <Pressable
          style={[
            styles.box,
            {
              width: boxSize,
              height: boxSize,
              borderWidth,
              borderRadius: Radius.sm,
            },
            isChecked || isIndeterminate
              ? { backgroundColor: primary, borderColor: primary }
              : { borderColor: mutedFg },
            isDisabled && styles.disabled,
          ]}
        >
          {(isChecked || isIndeterminate) && (
            <Text
              style={[styles.icon, { fontSize: iconSize, color: primaryFg }]}
            >
              {isIndeterminate ? '−' : '✓'}
            </Text>
          )}
        </Pressable>
        {label && (
          <Text
            style={[
              styles.label,
              {
                fontSize:
                  FontSizes[
                    size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'base'
                  ],
              },
              isDisabled && styles.disabledLabel,
            ]}
          >
            {label}
          </Text>
        )}
      </Pressable>
    );
  }
);

Checkbox.displayName = 'Checkbox';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    fontWeight: '700',
  },
  label: {
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledLabel: {
    opacity: 0.5,
  },
});
