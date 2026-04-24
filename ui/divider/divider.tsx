import { useMemo } from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { Colors, FontSizes, Spacing, useThemeColor } from '../theme';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSize = 'sm' | 'md' | 'lg';
export type DividerLabelPosition = 'left' | 'center' | 'right';

export interface DividerProps extends Omit<ViewProps, 'orientation'> {
  orientation?: DividerOrientation;
  size?: DividerSize;
  label?: string;
  labelPosition?: DividerLabelPosition;
}

const ORIENTATION_HEIGHT: Record<DividerSize, number> = {
  sm: 1,
  md: 2,
  lg: 4,
};

const ORIENTATION_WIDTH: Record<DividerSize, number> = {
  sm: 1,
  md: 2,
  lg: 4,
};

const VERTICAL_HEIGHT: Record<DividerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export function Divider({
  orientation = 'horizontal',
  size = 'md',
  label,
  labelPosition = 'center',
  style,
  ...props
}: DividerProps) {
  const borderColor = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });
  const mutedForeground = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });

  const containerStyle = useMemo(() => {
    if (orientation === 'vertical') {
      return [
        styles.verticalContainer,
        { height: VERTICAL_HEIGHT[size], width: ORIENTATION_WIDTH[size] },
      ];
    }
    return [styles.horizontalContainer, { height: ORIENTATION_HEIGHT[size] }];
  }, [orientation, size]);

  const lineStyle = useMemo(() => {
    if (orientation === 'vertical') {
      return [
        styles.verticalLine,
        {
          width: ORIENTATION_WIDTH[size],
          backgroundColor: borderColor,
        },
      ];
    }
    return [
      styles.horizontalLine,
      {
        height: ORIENTATION_HEIGHT[size],
        backgroundColor: borderColor,
      },
    ];
  }, [orientation, size, borderColor]);

  if (!label) {
    return (
      <View style={[containerStyle, style]} {...props}>
        <View style={lineStyle} />
      </View>
    );
  }

  const labelWrapperStyle = useMemo(() => {
    const baseStyle =
      orientation === 'vertical'
        ? styles.verticalLabelWrapper
        : styles.horizontalLabelWrapper;

    const positionStyle: Record<DividerLabelPosition, object> = {
      left: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      right: { justifyContent: 'flex-end' },
    };

    return [baseStyle, positionStyle[labelPosition]];
  }, [orientation, labelPosition]);

  return (
    <View style={[containerStyle, style]} {...props}>
      {orientation === 'horizontal' && labelPosition === 'left' && (
        <View style={lineStyle} />
      )}
      <View style={labelWrapperStyle}>
        <Text
          style={[
            styles.label,
            { color: mutedForeground },
            orientation === 'vertical' && styles.verticalLabel,
          ]}
        >
          {label}
        </Text>
      </View>
      {orientation === 'horizontal' && labelPosition !== 'left' && (
        <View style={lineStyle} />
      )}
      {orientation === 'horizontal' && labelPosition === 'left' && (
        <View style={[lineStyle, styles.rightLine]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  horizontalLine: {
    flex: 1,
  },
  verticalLine: {
    flex: 1,
    height: '100%',
  },
  horizontalLabelWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: Spacing[3],
  },
  verticalLabelWrapper: {
    paddingVertical: Spacing[2],
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  verticalLabel: {
    writingDirection: 'ltr',
  },
  rightLine: {
    flex: 1,
  },
});
