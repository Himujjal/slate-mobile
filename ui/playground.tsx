import { useMemo, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ButtonDemo } from './button/button-demo';
import { SIDEBAR_WIDTH } from './sidebar/sidebar';
import { SidebarDemo } from './sidebar/sidebar-demo';
import { TextInputDemo } from './text-input/text-input-demo';
import { TextDemo } from './text/text-demo';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from './theme';

type ComponentName =
  | 'Button'
  | 'TextInput'
  | 'Card'
  | 'Avatar'
  | 'Badge'
  | 'Chip'
  | 'Checkbox'
  | 'Switch'
  | 'Slider'
  | 'RadioButton'
  | 'Text'
  | 'Icon'
  | 'Image'
  | 'Divider'
  | 'ListItem'
  | 'FAB'
  | 'Modal'
  | 'BottomSheet'
  | 'Toast'
  | 'Skeleton'
  | 'Sidebar';

const COMPONENTS: ComponentName[] = [
  'Button',
  'Text',
  'TextInput',
  'Card',
  'Avatar',
  'Badge',
  'Chip',
  'Divider',
  'ListItem',
  'Icon',
  'Image',
  'Checkbox',
  'Switch',
  'Slider',
  'RadioButton',
  'FAB',
  'Modal',
  'BottomSheet',
  'Toast',
  'Skeleton',
  'Sidebar',
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MOBILE_BREAKPOINT = 768;

interface PlaygroundProps {
  selectedComponent?: ComponentName;
  onSelectComponent?: (component: ComponentName) => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(SCREEN_WIDTH < MOBILE_BREAKPOINT);

  if (Platform.OS !== 'web') {
    return true;
  }

  return isMobile;
}

function DemoPlaceholder() {
  const cardBg = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });
  const fg = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  return (
    <View
      style={{
        backgroundColor: cardBg,
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
      }}
    >
      <Text
        style={{
          fontSize: FontSizes.xl,
          fontWeight: '600',
          color: fg,
          marginBottom: 8,
        }}
      >
        Coming Soon
      </Text>
      <Text
        style={{
          fontSize: FontSizes.base,
          color: mutedFg,
          textAlign: 'center',
        }}
      >
        Demo not yet implemented. Check back soon!
      </Text>
    </View>
  );
}

function DemoContent({ component }: { component: ComponentName }) {
  switch (component) {
    case 'Button':
      return <ButtonDemo />;
    case 'Sidebar':
      return <SidebarDemo />;
    case 'Text':
      return <TextDemo />;
    case 'TextInput':
      return <TextInputDemo />;
    default:
      return <DemoPlaceholder />;
  }
}

function DemoSidebar({
  items,
  selected,
  onSelect,
  collapsed,
  onToggleCollapse,
}: {
  items: ComponentName[];
  selected: ComponentName;
  onSelect: (component: ComponentName) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
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

  const sidebarStyles = useMemo(
    () =>
      StyleSheet.create({
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
        sidebarHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: Spacing[4],
          marginBottom: Spacing[2],
        },
        sidebarTitle: {
          fontSize: FontSizes.xs,
          fontWeight: '600',
          color: mutedFg,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        sidebarToggle: {
          padding: Spacing[1],
        },
        sidebarToggleIcon: {
          fontSize: FontSizes.lg,
          color: mutedFg,
        },
        sidebarList: {
          flex: 1,
        },
        sidebarItem: {
          paddingVertical: Spacing[3],
          paddingHorizontal: Spacing[4],
          marginHorizontal: Spacing[2],
          borderRadius: Radius.md,
        },
        sidebarItemActive: {
          backgroundColor: primaryBg,
        },
        sidebarItemText: {
          fontSize: FontSizes.sm,
          color: fg,
        },
        sidebarItemTextActive: {
          color: primaryFg,
          fontWeight: '500',
        },
      }),
    [cardBg, borderColor, mutedFg, primaryBg, fg, primaryFg]
  );

  return (
    <View
      style={[
        sidebarStyles.sidebar,
        collapsed && sidebarStyles.sidebarCollapsed,
      ]}
    >
      <View style={sidebarStyles.sidebarHeader}>
        {!collapsed && (
          <Text style={sidebarStyles.sidebarTitle}>Components</Text>
        )}
        {onToggleCollapse && (
          <TouchableOpacity
            style={sidebarStyles.sidebarToggle}
            onPress={onToggleCollapse}
            hitSlop={8}
          >
            <Text style={sidebarStyles.sidebarToggleIcon}>
              {collapsed ? '→' : '←'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {!collapsed && (
        <ScrollView
          style={sidebarStyles.sidebarList}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                sidebarStyles.sidebarItem,
                selected === item && sidebarStyles.sidebarItemActive,
              ]}
              onPress={() => onSelect(item)}
            >
              <Text
                style={[
                  sidebarStyles.sidebarItemText,
                  selected === item && sidebarStyles.sidebarItemTextActive,
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

export function Playground({
  selectedComponent,
  onSelectComponent,
}: PlaygroundProps) {
  const [selected, setSelected] = useState<ComponentName>(
    selectedComponent ?? 'Button'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const bg = useThemeColor({
    light: Colors.light.background,
    dark: Colors.dark.background,
  });
  const borderColor = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });
  const cardBg = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });
  const fg = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          flexDirection: 'row',
          backgroundColor: bg,
        },
        demoArea: {
          flex: 1,
          backgroundColor: bg,
        },
        demoAreaExpanded: {
          marginLeft: 0,
        },
        demoHeader: {
          paddingHorizontal: Spacing[6],
          paddingVertical: Spacing[4],
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        demoTitle: {
          fontSize: FontSizes['2xl'],
          fontWeight: '700',
          color: fg,
        },
        demoSubtitle: {
          fontSize: FontSizes.sm,
          color: mutedFg,
          marginTop: Spacing[1],
        },
        demoScroll: {
          flex: 1,
        },
        demoContent: {
          padding: Spacing[6],
        },
        placeholder: {
          backgroundColor: cardBg,
          borderRadius: Radius.xl,
          padding: Spacing[8],
          alignItems: 'center',
          width: '100%',
          maxWidth: 600,
        },
        placeholderTitle: {
          fontSize: FontSizes.xl,
          fontWeight: '600',
          color: fg,
          marginBottom: Spacing[2],
        },
        placeholderText: {
          fontSize: FontSizes.base,
          color: mutedFg,
          textAlign: 'center',
        },
      }),
    [bg, borderColor, cardBg, fg, mutedFg]
  );

  const handleSelect = (component: ComponentName) => {
    setSelected(component);
    onSelectComponent?.(component);
  };

  return (
    <View style={styles.container}>
      {!isMobile && (
        <DemoSidebar
          items={COMPONENTS}
          selected={selected}
          onSelect={handleSelect}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}
      <View
        style={[styles.demoArea, sidebarCollapsed && styles.demoAreaExpanded]}
      >
        <View style={styles.demoHeader}>
          <Text style={styles.demoTitle}>{selected}</Text>
          <Text style={styles.demoSubtitle}>Component Demo</Text>
        </View>
        <ScrollView
          style={styles.demoScroll}
          contentContainerStyle={styles.demoContent}
        >
          <DemoContent component={selected} />
        </ScrollView>
      </View>
    </View>
  );
}
