import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

export type SliderSize = 'sm' | 'md';

export interface SliderProps extends Omit<ViewProps, 'onValueChange'> {
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  size?: SliderSize;
}

const sizeStyles: Record<
  SliderSize,
  { trackHeight: number; thumbSize: number }
> = {
  sm: { trackHeight: 4, thumbSize: 16 },
  md: { trackHeight: 6, thumbSize: 20 },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

export interface SliderRef {
  getValue: () => number;
  setValue: (value: number) => void;
}

export const Slider = forwardRef<View | SliderRef, SliderProps>(
  (
    {
      value: controlledValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      label,
      disabled = false,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(controlledValue ?? min);
    const isControlled = controlledValue !== undefined;

    useEffect(() => {
      if (isControlled && controlledValue !== undefined) {
        setInternalValue(controlledValue);
      }
    }, [isControlled, controlledValue]);

    const currentValue = isControlled ? controlledValue : internalValue;

    const trackRef = useRef<View>(null);
    const trackWidth = useRef(0);
    const trackLayoutX = useRef(0);

    const mutedFg = useThemeColor({
      light: Colors.light.mutedForeground,
      dark: Colors.dark.mutedForeground,
    });
    const primary = useThemeColor({
      light: Colors.light.primary,
      dark: Colors.dark.primary,
    });

    const { trackHeight, thumbSize } = sizeStyles[size];

    const percentage = useMemo(() => {
      return ((currentValue - min) / (max - min)) * 100;
    }, [currentValue, min, max]);

    const thumbOffset = useMemo(() => {
      const width = trackWidth.current;
      if (width <= 0) return -thumbSize / 2;
      return (percentage / 100) * width - thumbSize / 2;
    }, [percentage, thumbSize]);

    const updateValue = useCallback(
      (pageX: number) => {
        const width = trackWidth.current;
        if (width <= 0) return;

        const relativeX = pageX - trackLayoutX.current;
        const newPercentage = clamp(relativeX / width, 0, 1);
        const rawValue = min + newPercentage * (max - min);
        const steppedValue = roundToStep(rawValue, step);
        const clampedValue = clamp(steppedValue, min, max);

        if (!isControlled) {
          setInternalValue(clampedValue);
        }
        onValueChange?.(clampedValue);
      },
      [min, max, step, isControlled, onValueChange]
    );

    const handlePress = useCallback(
      (event: GestureResponderEvent) => {
        if (disabled) return;
        const { pageX } = event.nativeEvent;
        updateValue(pageX);
      },
      [disabled, updateValue]
    );

    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => !disabled,
          onMoveShouldSetPanResponder: () => !disabled,
          onPanResponderGrant: (evt) => {
            const { pageX } = evt.nativeEvent;
            updateValue(pageX);
          },
          onPanResponderMove: (evt) => {
            const { pageX } = evt.nativeEvent;
            updateValue(pageX);
          },
        }),
      [disabled, updateValue]
    );

    const handleTrackLayout = useCallback((event: LayoutChangeEvent) => {
      const { width, x } = event.nativeEvent.layout;
      trackWidth.current = width;
      trackLayoutX.current = x;
    }, []);

    const getValue = useCallback(() => currentValue, [currentValue]);

    const setValue = useCallback(
      (value: number) => {
        const clampedValue = clamp(value, min, max);
        if (!isControlled) {
          setInternalValue(clampedValue);
        }
        onValueChange?.(clampedValue);
      },
      [min, max, isControlled, onValueChange]
    );

    useImperativeHandle(
      ref,
      () => ({
        getValue,
        setValue,
      }),
      [getValue, setValue]
    );

    const isDisabled = disabled;

    return (
      <View style={[props.style]}>
        {label && (
          <Text style={[styles.label, isDisabled && styles.disabledLabel]}>
            {label}
            <Text style={styles.valueText}> {currentValue}</Text>
          </Text>
        )}
        <View style={[styles.container, { minHeight: thumbSize }]}>
          <Pressable
            onPress={handlePress}
            disabled={isDisabled}
            ref={trackRef}
            {...panResponder.panHandlers}
          >
            <View
              onLayout={handleTrackLayout}
              style={[styles.track, { height: trackHeight }]}
            >
              <View
                style={[
                  styles.trackFilled,
                  {
                    backgroundColor: isDisabled ? mutedFg : primary,
                    height: trackHeight,
                    width: `${percentage}%`,
                  },
                ]}
              />
            </View>
            <View
              style={[
                styles.thumb,
                {
                  width: thumbSize,
                  height: thumbSize,
                  borderRadius: thumbSize / 2,
                  backgroundColor: isDisabled ? mutedFg : primary,
                  left: thumbOffset,
                },
              ]}
            />
          </Pressable>
        </View>
        <View style={styles.rangeContainer}>
          <Text style={[styles.rangeText, isDisabled && styles.disabledLabel]}>
            {min}
          </Text>
          <Text style={[styles.rangeText, isDisabled && styles.disabledLabel]}>
            {max}
          </Text>
        </View>
      </View>
    );
  }
);

Slider.displayName = 'Slider';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  track: {
    backgroundColor: Colors.light.muted,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  trackFilled: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: Radius.full,
  },
  thumb: {
    position: 'absolute',
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginBottom: Spacing[2],
  },
  valueText: {
    fontWeight: '400',
    color: Colors.light.mutedForeground,
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing[1],
  },
  rangeText: {
    fontSize: FontSizes.xs,
    color: Colors.light.mutedForeground,
  },
  disabledLabel: {
    opacity: 0.5,
  },
});
