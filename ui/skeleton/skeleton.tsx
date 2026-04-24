import { type ReactNode, forwardRef, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewProps } from 'react-native';
import { Colors, Radius, Spacing, useThemeColor } from '../theme';

export type SkeletonShape = 'text' | 'circle' | 'rounded-rect';

export interface SkeletonProps extends ViewProps {
  shape?: SkeletonShape;
  width?: number | string;
  height?: number;
  animated?: boolean;
  last?: boolean;
}

export const Skeleton = forwardRef<View, SkeletonProps>(
  (
    {
      shape = 'text',
      width = '100%',
      height,
      animated = true,
      last = false,
      style,
      ...props
    },
    ref
  ) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (!animated) {
        return;
      }

      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      animation.start();

      return () => {
        animation.stop();
      };
    }, [animated, animatedValue]);

    const backgroundColor = useThemeColor({
      light: Colors.light.muted,
      dark: Colors.dark.muted,
    });

    const shimmerColor = useThemeColor({
      light: Colors.light.accent,
      dark: Colors.dark.accent,
    });

    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0.8],
    });

    const heightValue = useMemo(() => {
      if (height !== undefined) {
        return height;
      }
      if (shape === 'circle') {
        return width as number;
      }
      if (shape === 'rounded-rect') {
        return 80;
      }
      return 16;
    }, [shape, height, width]);

    const borderRadiusValue = useMemo(() => {
      if (shape === 'circle') {
        return typeof width === 'number' ? width / 2 : 9999;
      }
      if (shape === 'rounded-rect') {
        return Radius.md;
      }
      return last ? Radius.sm : 0;
    }, [shape, width, last]);

    const skeletonStyles = useMemo(() => {
      const baseStyles: object[] = [
        styles.base,
        {
          width,
          height: heightValue,
          borderRadius: borderRadiusValue,
          backgroundColor,
        },
      ];

      if (animated) {
        baseStyles.push({ opacity });
      }

      return baseStyles;
    }, [
      width,
      heightValue,
      borderRadiusValue,
      backgroundColor,
      animated,
      opacity,
    ]);

    return (
      <View ref={ref} style={[skeletonStyles, style]} {...props}>
        {animated && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                backgroundColor: shimmerColor,
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.5, 0],
                }),
              },
            ]}
          />
        )}
      </View>
    );
  }
);

Skeleton.displayName = 'Skeleton';

export interface SkeletonGroupProps extends ViewProps {
  children?: ReactNode;
  spacing?: number;
}

export function SkeletonGroup({
  children,
  spacing = Spacing[2],
  style,
  ...props
}: SkeletonGroupProps) {
  return (
    <View style={[styles.group, { gap: spacing }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  group: {
    width: '100%',
  },
});
