import { type ReactNode, forwardRef, useCallback, useMemo } from 'react';
import {
  Pressable,
  type PressableProps,
  Modal as RNModal,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { Button } from '../button/button';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

type ModalSize = 'sm' | 'md' | 'lg';
type ModalAnimationType = 'none' | 'slide' | 'fade';
type ButtonVariant = 'filled' | 'outlined' | 'text' | 'ghost';
type ButtonColor = 'primary' | 'secondary' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ModalAction extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  onPress?: () => void;
}

interface ModalProps extends ViewProps {
  visible: boolean;
  title?: string;
  children?: ReactNode;
  actions?: ModalAction[];
  closable?: boolean;
  size?: ModalSize;
  animationType?: ModalAnimationType;
  onClose?: () => void;
}

const sizeWidths: Record<ModalSize, number> = {
  sm: 280,
  md: 340,
  lg: 420,
};

export const Modal = forwardRef<View, ModalProps>(
  (
    {
      visible,
      title,
      children,
      actions,
      closable = true,
      size = 'md',
      animationType = 'fade',
      onClose,
      style,
      ...props
    },
    ref
  ) => {
    const backgroundColor = useThemeColor({
      light: Colors.light.background,
      dark: Colors.dark.background,
    });
    const cardBackground = useThemeColor({
      light: Colors.light.card,
      dark: Colors.dark.card,
    });
    const foregroundColor = useThemeColor({
      light: Colors.light.foreground,
      dark: Colors.dark.foreground,
    });
    const mutedFg = useThemeColor({
      light: Colors.light.mutedForeground,
      dark: Colors.dark.mutedForeground,
    });
    const borderColor = useThemeColor({
      light: Colors.light.border,
      dark: Colors.dark.border,
    });

    const handleClose = useCallback(() => {
      onClose?.();
    }, [onClose]);

    const modalStyles = useMemo(
      () =>
        StyleSheet.create({
          overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          },
          container: {
            width: sizeWidths[size],
            backgroundColor: cardBackground,
            borderRadius: Radius.xl,
            borderWidth: 1,
            borderColor: borderColor,
            overflow: 'hidden',
            maxHeight: '80%',
          },
          header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: Spacing[4],
            paddingTop: Spacing[4],
            paddingBottom: Spacing[2],
          },
          titleText: {
            fontSize: FontSizes.lg,
            fontWeight: '600',
            color: foregroundColor,
            flex: 1,
          },
          closeButton: {
            padding: Spacing[1],
          },
          closeText: {
            fontSize: FontSizes.xl,
            color: mutedFg,
          },
          content: {
            paddingHorizontal: Spacing[4],
            paddingBottom: Spacing[3],
          },
          contentText: {
            fontSize: FontSizes.base,
            color: foregroundColor,
            lineHeight: FontSizes.base * 1.5,
          },
          footer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: Spacing[2],
            paddingHorizontal: Spacing[4],
            paddingTop: Spacing[3],
            paddingBottom: Spacing[4],
            borderTopWidth: 1,
            borderTopColor: borderColor,
          },
        }),
      [size, cardBackground, borderColor, foregroundColor, mutedFg]
    );

    const showHeader = title || (closable && onClose);
    const showFooter = actions && actions.length > 0;

    return (
      <RNModal
        ref={ref}
        visible={visible}
        transparent
        animationType={animationType}
        onRequestClose={handleClose}
        {...props}
      >
        <View style={modalStyles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closable ? handleClose : undefined}
          />
          <View style={modalStyles.container}>
            {showHeader && (
              <View style={modalStyles.header}>
                {title ? (
                  <Text style={modalStyles.titleText} numberOfLines={1}>
                    {title}
                  </Text>
                ) : (
                  <View style={{ flex: 1 }} />
                )}
                {closable && onClose && (
                  <Pressable
                    style={modalStyles.closeButton}
                    onPress={handleClose}
                    hitSlop={8}
                  >
                    <Text style={modalStyles.closeText}>×</Text>
                  </Pressable>
                )}
              </View>
            )}
            {children && <View style={modalStyles.content}>{children}</View>}
            {showFooter && (
              <View style={modalStyles.footer}>
                {actions?.map((action, index) => (
                  <Button
                    key={`${action.label}-${index}`}
                    variant={action.variant ?? 'text'}
                    size={action.size ?? 'sm'}
                    color={action.color}
                    disabled={action.disabled}
                    onPress={action.onPress}
                  >
                    {action.label}
                  </Button>
                ))}
              </View>
            )}
          </View>
        </View>
      </RNModal>
    );
  }
);

Modal.displayName = 'Modal';
