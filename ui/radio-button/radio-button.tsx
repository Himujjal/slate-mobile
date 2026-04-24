import { forwardRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { Colors, FontSizes, Spacing, useThemeColor } from '../theme';

export type RadioButtonSize = 'sm' | 'md' | 'lg';

export interface RadioButtonProps extends Omit<ViewProps, 'onPress'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: RadioButtonSize;
  value?: string;
}

const sizeStyles: Record<
  RadioButtonSize,
  { boxSize: number; borderWidth: number; dotSize: number }
> = {
  sm: { boxSize: 18, borderWidth: 2, dotSize: 8 },
  md: { boxSize: 22, borderWidth: 2, dotSize: 10 },
  lg: { boxSize: 26, borderWidth: 3, dotSize: 12 },
};

export const RadioButton = forwardRef<View, RadioButtonProps>(
  (
    {
      checked = false,
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
      onCheckedChange?.(!checked);
    };

    const { boxSize, borderWidth, dotSize } = sizeStyles[size];
    const isDisabled = disabled;

    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={isDisabled}
        style={[styles.container, props.style]}
        aria-role="radio"
        aria-checked={checked}
      >
        <View
          style={[
            styles.box,
            {
              width: boxSize,
              height: boxSize,
              borderWidth,
              borderRadius: boxSize / 2,
            },
            checked
              ? { borderColor: primary, backgroundColor: primary }
              : { borderColor: mutedFg },
            isDisabled && styles.disabled,
          ]}
        >
          {checked && (
            <View
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: primaryFg,
                },
              ]}
            />
          )}
        </View>
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

RadioButton.displayName = 'RadioButton';

export interface RadioGroupProps extends ViewProps {
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
}

function processChildren(
  children: React.ReactNode,
  groupValue?: string,
  onValueChange?: (value: string) => void
): React.ReactNode[] {
  const childArray = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];
  return childArray.map((child, index) => {
    if (!child || typeof child !== 'object') return child;
    const childElement = child as React.ReactElement<RadioButtonProps>;
    if (childElement?.props?.value !== undefined) {
      const itemValue = childElement.props.value;
      const isChecked = groupValue === itemValue;
      return (
        <RadioButton
          key={childElement.key ?? index}
          checked={isChecked}
          onCheckedChange={() => onValueChange?.(itemValue ?? '')}
          disabled={childElement.props.disabled}
          label={childElement.props.label as string}
          size={childElement.props.size}
        />
      );
    }
    return child;
  });
}

export function RadioGroup({
  value,
  onValueChange,
  label,
  children,
  ...props
}: RadioGroupProps & { children?: React.ReactNode }) {
  const enhancedChildren = processChildren(children, value, onValueChange);

  return (
    <View style={props.style} role="radiogroup">
      {label && (
        <Text style={[styles.groupLabel, { fontSize: FontSizes.base }]}>
          {label}
        </Text>
      )}
      <View style={styles.groupContainer}>{enhancedChildren}</View>
    </View>
  );
}

RadioGroup.displayName = 'RadioGroup';

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
  dot: {
    position: 'absolute',
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
  groupLabel: {
    fontWeight: '600',
    marginBottom: Spacing[2],
  },
  groupContainer: {
    gap: Spacing[3],
  },
});
