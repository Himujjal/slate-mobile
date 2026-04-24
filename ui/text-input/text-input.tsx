import { forwardRef, useMemo, useState } from 'react';
import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

type InputVariant = 'outlined' | 'filled' | 'ghost';
type InputSize = 'sm' | 'md' | 'lg';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const sizeStyles: Record<InputSize, object> = {
  sm: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    fontSize: FontSizes.sm,
  },
  md: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    fontSize: FontSizes.base,
  },
  lg: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    fontSize: FontSizes.lg,
  },
};

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    { variant = 'outlined', size = 'md', label, error, disabled, ...props },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const inputBorder = useThemeColor({
      light: Colors.light.input,
      dark: Colors.dark.input,
    });
    const mutedBg = useThemeColor({
      light: Colors.light.muted,
      dark: Colors.dark.muted,
    });
    const mutedFg = useThemeColor({
      light: Colors.light.mutedForeground,
      dark: Colors.dark.mutedForeground,
    });
    const primaryColor = useThemeColor({
      light: Colors.light.primary,
      dark: Colors.dark.primary,
    });
    const fgColor = useThemeColor({
      light: Colors.light.foreground,
      dark: Colors.dark.foreground,
    });
    const destructiveColor = useThemeColor({
      light: Colors.light.destructive,
      dark: Colors.dark.destructive,
    });

    const variantStyle = useMemo(() => {
      switch (variant) {
        case 'outlined':
          return {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: inputBorder,
          };
        case 'filled':
          return { backgroundColor: mutedBg, borderWidth: 0 };
        case 'ghost':
          return { backgroundColor: 'transparent', borderWidth: 0 };
      }
    }, [variant, inputBorder, mutedBg]);

    const labelColor = error ? destructiveColor : mutedFg;

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        )}
        <RNTextInput
          ref={ref}
          style={[
            styles.input,
            variantStyle,
            sizeStyles[size],
            { color: fgColor },
            focused && { borderColor: primaryColor },
            error && { borderColor: destructiveColor },
          ]}
          placeholderTextColor={mutedFg}
          editable={!disabled}
          onFocus={(e) => {
            if (!disabled) {
              setFocused(true);
              props.onFocus?.(e);
            }
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && (
          <Text style={[styles.errorText, { color: destructiveColor }]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: Spacing[1],
  },
  label: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing[1],
  },
  input: {
    borderRadius: Radius.md,
  },
  errorText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing[1],
  },
});
