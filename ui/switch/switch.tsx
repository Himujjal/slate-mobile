import { useEffect, useRef } from 'react';
import { forwardRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type View,
  type ViewProps,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

export type SwitchState = boolean;

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<ViewProps, 'onPress'> {
  value?: SwitchState;
  onValueChange?: (value: SwitchState) => void;
  label?: string;
  disabled?: boolean;
  size?: SwitchSize;
}

const sizeStyles: Record<
  SwitchSize,
  {
    trackWidth: number;
    trackHeight: number;
    thumbSize: number;
    thumbOffset: number;
  }
> = {
  sm: { trackWidth: 36, trackHeight: 22, thumbSize: 16, thumbOffset: 3 },
  md: { trackWidth: 44, trackHeight: 26, thumbSize: 20, thumbOffset: 3 },
  lg: { trackWidth: 52, trackHeight: 30, thumbSize: 24, thumbOffset: 3 },
};

export const Switch = forwardRef<View, SwitchProps>(
  (
    {
      value = false,
      onValueChange,
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

    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [value, animatedValue]);

    const handlePress = () => {
      if (disabled) return;
      onValueChange?.(!value);
    };

    const { trackWidth, trackHeight, thumbSize, thumbOffset } =
      sizeStyles[size];
    const isDisabled = disabled;
    const isOn = value;

    const thumbPosition = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [thumbOffset, trackWidth - thumbSize - thumbOffset],
    });

    const trackBackgroundColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [mutedFg, primary],
    });

    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={[styles.container, props.style]}
        role="switch"
        aria-checked={isOn}
      >
        <Animated.View
          ref={ref}
          style={[
            styles.track,
            {
              width: trackWidth,
              height: trackHeight,
              borderRadius: trackHeight / 2,
              backgroundColor: trackBackgroundColor,
            },
            isDisabled && styles.disabled,
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                backgroundColor: primaryFg,
                transform: [{ translateX: thumbPosition }],
              },
            ]}
          />
        </Animated.View>
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

Switch.displayName = 'Switch';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  track: {
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
