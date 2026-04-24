import { type ReactNode, forwardRef, useMemo } from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { Colors, Radius, Spacing, useThemeColor } from '../theme';

type CardVariant = 'default' | 'filled';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends ViewProps {
  /** The visual style of the card */
  variant?: CardVariant;
  /** The padding inside the card */
  padding?: CardPadding;
  /** Whether the card has a shadow/elevation effect */
  elevated?: boolean;
  /** The content of the card */
  children?: ReactNode;
}

const paddingStyles: Record<CardPadding, object> = {
  none: { padding: Spacing[0] },
  sm: { padding: Spacing[3] },
  md: { padding: Spacing[4] },
  lg: { padding: Spacing[6] },
  xl: { padding: Spacing[8] },
};

const radiusStyles: Record<CardPadding, object> = {
  none: { borderRadius: Radius.none },
  sm: { borderRadius: Radius.sm },
  md: { borderRadius: Radius.md },
  lg: { borderRadius: Radius.lg },
  xl: { borderRadius: Radius.xl },
};

export const Card = forwardRef<View, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      elevated = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const cardBackground = useThemeColor({
      light: Colors.light.card,
      dark: Colors.dark.card,
    });
    const cardForeground = useThemeColor({
      light: Colors.light.cardForeground,
      dark: Colors.dark.cardForeground,
    });
    const borderColor = useThemeColor({
      light: Colors.light.border,
      dark: Colors.dark.border,
    });
    const secondaryBg = useThemeColor({
      light: Colors.light.secondary,
      dark: Colors.dark.secondary,
    });

    const cardStyles = useMemo(() => {
      const baseStyles: object[] = [
        styles.base,
        paddingStyles[padding],
        radiusStyles[padding],
      ];

      if (variant === 'filled') {
        baseStyles.push({
          backgroundColor: secondaryBg,
          borderWidth: 0,
        });
      } else {
        baseStyles.push({
          backgroundColor: cardBackground,
          borderWidth: 1,
          borderColor: borderColor,
        });
      }

      if (elevated) {
        if (Platform.OS === 'android') {
          baseStyles.push({ elevation: 4 });
        } else {
          baseStyles.push({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          });
        }
      }

      return baseStyles;
    }, [variant, padding, elevated, cardBackground, borderColor, secondaryBg]);

    return (
      <View ref={ref} style={[cardStyles, style]} {...props}>
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
