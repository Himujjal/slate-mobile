import { SIDEBAR_WIDTH } from '@ui/sidebar/sidebar';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '@ui/theme';
import { ThemeToggleButton } from '@ui/theme';

import { AvatarDemo } from '@ui/avatar/avatar-demo';
import { BadgeDemo } from '@ui/badge/badge-demo';
import { BottomSheetDemo } from '@ui/bottom-sheet/bottom-sheet-demo';
import { ButtonDemo } from '@ui/button/button-demo';
import { CardDemo } from '@ui/card/card-demo';
import { CheckboxDemo } from '@ui/checkbox/checkbox-demo';
import { ChipDemo } from '@ui/chip/chip-demo';
import { DividerDemo } from '@ui/divider/divider-demo';
import { FabDemo } from '@ui/fab/fab-demo';
import { IconDemo } from '@ui/icon/icon-demo';
import { ImageDemo } from '@ui/image/image-demo';
import { ListItemDemo } from '@ui/list-item/list-item-demo';
import { ModalDemo } from '@ui/modal/modal-demo';
import { RadioButtonDemo } from '@ui/radio-button/radio-button-demo';
import { SidebarDemo } from '@ui/sidebar/sidebar-demo';
import { SkeletonDemo } from '@ui/skeleton/skeleton-demo';
import { SliderDemo } from '@ui/slider/slider-demo';
import { SwitchDemo } from '@ui/switch/switch-demo';
import { TextInputDemo } from '@ui/text-input/text-input-demo';
import { TextDemo } from '@ui/text/text-demo';
import { ToastDemo } from '@ui/toast/toast-demo';

import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

const DEMO_MAP: Record<string, () => React.JSX.Element> = {
  button: ButtonDemo,
  text: TextDemo,
  textinput: TextInputDemo,
  card: CardDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  chip: ChipDemo,
  divider: DividerDemo,
  listitem: ListItemDemo,
  icon: IconDemo,
  image: ImageDemo,
  checkbox: CheckboxDemo,
  switch: SwitchDemo,
  slider: SliderDemo,
  radiobutton: RadioButtonDemo,
  fab: FabDemo,
  modal: ModalDemo,
  bottomsheet: BottomSheetDemo,
  toast: ToastDemo,
  skeleton: SkeletonDemo,
  sidebar: SidebarDemo,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile] = useState(SCREEN_WIDTH < MOBILE_BREAKPOINT);

  if (Platform.OS !== 'web') {
    return true;
  }

  return isMobile;
}

const ROUTE_MAP: Record<string, ComponentName> = {
  button: 'Button',
  text: 'Text',
  textinput: 'TextInput',
  card: 'Card',
  avatar: 'Avatar',
  badge: 'Badge',
  chip: 'Chip',
  divider: 'Divider',
  listitem: 'ListItem',
  icon: 'Icon',
  image: 'Image',
  checkbox: 'Checkbox',
  switch: 'Switch',
  slider: 'Slider',
  radiobutton: 'RadioButton',
  fab: 'FAB',
  modal: 'Modal',
  bottomsheet: 'BottomSheet',
  toast: 'Toast',
  skeleton: 'Skeleton',
  sidebar: 'Sidebar',
};

export default function PlaygroundLayout() {
  const navigation = useNavigation();
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ThemeToggleButton />,
      headerTitle: 'Playground',
    });
  }, [navigation]);

  const { component } = useLocalSearchParams<{ component: string }>();
  const currentComponent = component?.toLowerCase() ?? 'button';
  const selected = ROUTE_MAP[currentComponent] ?? 'Button';

  const DemoComponent = useMemo(() => {
    const key = currentComponent;
    if (!key || !DEMO_MAP[key]) {
      return null;
    }
    return DEMO_MAP[key];
  }, [currentComponent]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const bg = useThemeColor({
    light: Colors.light.background,
    dark: Colors.dark.background,
  });
  const cardBg = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });
  const borderColor = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });
  const fg = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const primaryBg = useThemeColor({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });
  const primaryFg = useThemeColor({
    light: Colors.light.primaryForeground,
    dark: Colors.dark.primaryForeground,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          flexDirection: 'row',
          backgroundColor: bg,
          minHeight: 0,
        },
        demoArea: {
          flex: 1,
          backgroundColor: bg,
          minHeight: 0,
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
          minHeight: 0,
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
    [bg, borderColor, cardBg, fg, mutedFg, primaryBg, primaryFg]
  );

  const getRouteForComponent = (
    component: ComponentName
  ): `/dev-tools/playground?component=${string}` => {
    return `/dev-tools/playground?component=${component.toLowerCase()}`;
  };

  return (
    <View style={styles.container}>
      {!isMobile && (
        <View
          style={[styles.sidebar, sidebarCollapsed && styles.sidebarCollapsed]}
        >
          <View style={styles.sidebarHeader}>
            {!sidebarCollapsed && (
              <Text style={styles.sidebarTitle}>Components</Text>
            )}
            <TouchableOpacity
              style={styles.sidebarToggle}
              onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
              hitSlop={8}
            >
              <Text style={styles.sidebarToggleIcon}>
                {sidebarCollapsed ? '→' : '←'}
              </Text>
            </TouchableOpacity>
          </View>
          {!sidebarCollapsed && (
            <ScrollView
              style={styles.sidebarList}
              showsVerticalScrollIndicator={false}
            >
              {COMPONENTS.map((item) => {
                const route = getRouteForComponent(item);
                const isActive = currentComponent === item.toLowerCase();
                return (
                  <Link
                    key={item}
                    href={route}
                    style={[
                      styles.sidebarItem,
                      isActive && styles.sidebarItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sidebarItemText,
                        isActive && styles.sidebarItemTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {item}
                    </Text>
                  </Link>
                );
              })}
            </ScrollView>
          )}
        </View>
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
          contentContainerStyle={{ padding: Spacing[6] }}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          scrollIndicatorInsets={{ right: 1 }}
        >
          {DemoComponent ? <DemoComponent /> : null}
        </ScrollView>
      </View>
    </View>
  );
}
