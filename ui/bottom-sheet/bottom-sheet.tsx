import { type ReactNode, useCallback, useMemo } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

type BottomSheetSnapPoint = number | string;

interface BottomSheetPropsBase extends ViewProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;
  /** Callback when visibility changes */
  onVisibleChange: (visible: boolean) => void;
  /** Snap points for the bottom sheet (percentage or pixel values) */
  snapPoints?: BottomSheetSnapPoint[];
  /** Title text displayed at the top of the bottom sheet */
  title?: string;
  /** Whether to show the drag handle */
  showDragHandle?: boolean;
  /** Whether the bottom sheet can be closed by pressing backdrop */
  closable?: boolean;
  /** Whether to enable drag to dismiss */
  draggable?: boolean;
  /** The content of the bottom sheet */
  children?: ReactNode;
}

function normalizeSnapPoint(
  point: BottomSheetSnapPoint,
  screenHeight: number
): number {
  if (typeof point === 'number') {
    return point;
  }
  if (typeof point === 'string') {
    if (point.endsWith('%')) {
      const percentage = Number.parseFloat(point) / 100;
      return screenHeight * percentage;
    }
    return Number.parseFloat(point);
  }
  return 0;
}

export interface BottomSheetProps extends BottomSheetPropsBase {
  screenHeight?: number;
}

export function BottomSheet({
  visible,
  onVisibleChange,
  snapPoints = ['50%'],
  title,
  showDragHandle = true,
  closable = true,
  draggable = true,
  children,
  screenHeight: screenHeightProp,
  style,
  ...props
}: BottomSheetProps) {
  const screenHeight = screenHeightProp ?? 400;
  const currentSnapPoint = snapPoints[0];

  const sheetBackground = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });
  const sheetForeground = useThemeColor({
    light: Colors.light.cardForeground,
    dark: Colors.dark.cardForeground,
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
    if (closable) {
      onVisibleChange(false);
    }
  }, [closable, onVisibleChange]);

  const sheetHeight = useMemo(() => {
    return normalizeSnapPoint(currentSnapPoint, screenHeight);
  }, [currentSnapPoint, screenHeight]);

  const backdropOpacity = useThemeColor(
    { light: 'rgba(0, 0, 0, 0.5)', dark: 'rgba(0, 0, 0, 0.7)' },
    'background'
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        container: {
          flex: 1,
          justifyContent: 'flex-end',
        },
        sheet: {
          backgroundColor: sheetBackground,
          borderTopLeftRadius: Radius['2xl'],
          borderTopRightRadius: Radius['2xl'],
          borderTopWidth: 1,
          borderTopColor: borderColor,
          maxHeight: screenHeight,
          minHeight: sheetHeight,
          paddingBottom: Spacing[8],
        },
        dragHandleContainer: {
          alignItems: 'center',
          paddingVertical: Spacing[3],
        },
        dragHandle: {
          width: 40,
          height: 4,
          borderRadius: Radius.full,
          backgroundColor: mutedFg,
        },
        content: {
          paddingHorizontal: Spacing[4],
        },
        titleContainer: {
          paddingHorizontal: Spacing[4],
          paddingBottom: Spacing[4],
        },
        title: {
          fontSize: FontSizes.lg,
          fontWeight: '600',
          color: sheetForeground,
        },
      }),
    [
      sheetBackground,
      borderColor,
      screenHeight,
      sheetHeight,
      mutedFg,
      sheetForeground,
    ]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {closable && (
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        )}
        <View style={[styles.container, style]} {...props}>
          <View style={[styles.sheet, { height: sheetHeight }]}>
            {showDragHandle && draggable && (
              <View style={styles.dragHandleContainer}>
                <View style={styles.dragHandle} />
              </View>
            )}
            {title && (
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>
            )}
            <View style={styles.content}>{children}</View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export type { BottomSheetPropsBase, BottomSheetSnapPoint };
