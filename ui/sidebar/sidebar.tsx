import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MOBILE_BREAKPOINT = 768;
export const SIDEBAR_WIDTH = 240;

export interface SidebarProps {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  items,
  selected,
  onSelect,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const isMobile = Platform.OS !== 'web' || SCREEN_WIDTH < MOBILE_BREAKPOINT;

  const cardBg = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });
  const borderColor = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const primaryBg = useThemeColor({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });
  const fg = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const primaryFg = useThemeColor({
    light: Colors.light.primaryForeground,
    dark: Colors.dark.primaryForeground,
  });

  const styles = StyleSheet.create({
    sidebar: {
      width: SIDEBAR_WIDTH,
      backgroundColor: cardBg,
      borderRightWidth: 1,
      borderRightColor: borderColor,
      paddingTop: Spacing[6],
    },
    sidebarCollapsed: {
      width: 48,
      alignItems: 'center',
      paddingTop: Spacing[4],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing[4],
      marginBottom: Spacing[2],
    },
    title: {
      fontSize: FontSizes.xs,
      fontWeight: '600',
      color: mutedFg,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    toggleButton: {
      padding: Spacing[1],
    },
    toggleIcon: {
      fontSize: FontSizes.lg,
      color: mutedFg,
    },
    list: {
      flex: 1,
    },
    item: {
      paddingVertical: Spacing[3],
      paddingHorizontal: Spacing[4],
      marginHorizontal: Spacing[2],
      borderRadius: Radius.md,
    },
    itemActive: {
      backgroundColor: primaryBg,
    },
    itemText: {
      fontSize: FontSizes.sm,
      color: fg,
    },
    itemTextActive: {
      color: primaryFg,
      fontWeight: '500',
    },
  });

  if (isMobile) {
    return null;
  }

  return (
    <View style={[styles.sidebar, collapsed && styles.sidebarCollapsed]}>
      <View style={styles.header}>
        {!collapsed && <Text style={styles.title}>Components</Text>}
        {onToggleCollapse && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={onToggleCollapse}
            hitSlop={8}
          >
            <Text style={styles.toggleIcon}>{collapsed ? '→' : '←'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!collapsed && (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.item, selected === item && styles.itemActive]}
              onPress={() => onSelect(item)}
            >
              <Text
                style={[
                  styles.itemText,
                  selected === item && styles.itemTextActive,
                ]}
                numberOfLines={1}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
