import { useMemo } from 'react';
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { Colors, FontSizes, useThemeColor } from '../theme';

type TextVariant = 'default' | 'muted' | 'title' | 'subtitle' | 'caption';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
}

export function Text({ variant = 'default', style, ...props }: TextProps) {
  const foreground = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const mutedForeground = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });

  const variantStyle: TextStyle = useMemo(() => {
    switch (variant) {
      case 'default':
        return { fontSize: FontSizes.base, color: foreground };
      case 'muted':
        return { fontSize: FontSizes.base, color: mutedForeground };
      case 'title':
        return {
          fontSize: FontSizes['2xl'],
          fontWeight: 700,
          color: foreground,
        };
      case 'subtitle':
        return { fontSize: FontSizes.xl, fontWeight: 600, color: foreground };
      case 'caption':
        return { fontSize: FontSizes.sm, color: mutedForeground };
    }
  }, [variant, foreground, mutedForeground]);

  return <RNText style={[variantStyle, style]} {...props} />;
}
