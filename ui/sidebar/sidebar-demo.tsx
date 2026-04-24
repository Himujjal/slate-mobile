import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { SIDEBAR_WIDTH, Sidebar } from './sidebar';

const ITEMS = [
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

export function SidebarDemo() {
  const [selected, setSelected] = useState('Button');
  const [collapsed, setCollapsed] = useState(false);

  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const mutedBg = useThemeColor({
    light: Colors.light.muted,
    dark: Colors.dark.muted,
  });
  const bg = useThemeColor({
    light: Colors.light.background,
    dark: Colors.dark.background,
  });
  const fg = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const primaryColor = useThemeColor({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: Spacing[6],
        },
        section: {
          gap: Spacing[3],
        },
        sectionTitle: {
          fontSize: FontSizes.sm,
          fontWeight: '600',
          color: mutedFg,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        demoBox: {
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
        },
        demoFrame: {
          flexDirection: 'row',
          height: 300,
          backgroundColor: bg,
          borderRadius: Radius.md,
          overflow: 'hidden',
        },
        contentArea: {
          flex: 1,
          padding: Spacing[4],
          justifyContent: 'center',
          alignItems: 'center',
        },
        contentAreaCollapsed: {
          marginLeft: 0,
        },
        contentText: {
          fontSize: FontSizes.base,
          color: fg,
        },
        table: {
          gap: Spacing[2],
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
        },
        tableRow: {
          flexDirection: 'row',
          gap: Spacing[4],
        },
        propName: {
          width: 120,
          fontSize: FontSizes.sm,
          fontFamily: 'monospace',
          color: fg,
        },
        propType: {
          width: 80,
          fontSize: FontSizes.sm,
          fontFamily: 'monospace',
          color: primaryColor,
        },
        propDesc: {
          flex: 1,
          fontSize: FontSizes.sm,
          color: mutedFg,
        },
        note: {
          gap: Spacing[2],
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
        },
        noteText: {
          fontSize: FontSizes.sm,
          color: mutedFg,
        },
      }),
    [mutedFg, mutedBg, bg, fg, primaryColor]
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default Sidebar (Expanded)</Text>
        <View style={styles.demoBox}>
          <View style={styles.demoFrame}>
            <Sidebar items={ITEMS} selected={selected} onSelect={setSelected} />
            <View style={styles.contentArea}>
              <Text style={styles.contentText}>Selected: {selected}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collapsible Sidebar</Text>
        <View style={styles.demoBox}>
          <View style={styles.demoFrame}>
            <Sidebar
              items={ITEMS}
              selected={selected}
              onSelect={setSelected}
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed(!collapsed)}
            />
            <View
              style={[
                styles.contentArea,
                collapsed && styles.contentAreaCollapsed,
              ]}
            >
              <Text style={styles.contentText}>
                {collapsed
                  ? `Sidebar collapsed (${SIDEBAR_WIDTH}px hidden)`
                  : `Sidebar expanded (${SIDEBAR_WIDTH}px visible)`}
              </Text>
              <Text style={styles.contentText}>Selected: {selected}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Props Reference</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>items</Text>
            <Text style={styles.propType}>string[]</Text>
            <Text style={styles.propDesc}>List of component names</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>selected</Text>
            <Text style={styles.propType}>string</Text>
            <Text style={styles.propDesc}>Currently selected item</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>onSelect</Text>
            <Text style={styles.propType}>function</Text>
            <Text style={styles.propDesc}>Callback when item is tapped</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>collapsed</Text>
            <Text style={styles.propType}>boolean</Text>
            <Text style={styles.propDesc}>Controls collapsed state</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>onToggleCollapse</Text>
            <Text style={styles.propType}>function</Text>
            <Text style={styles.propDesc}>Callback to toggle collapse</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={styles.note}>
          <Text style={styles.noteText}>
            - On mobile (&lt; 768px), the sidebar is hidden (rendered as null)
          </Text>
          <Text style={styles.noteText}>
            - On desktop, the sidebar is visible and collapsible
          </Text>
          <Text style={styles.noteText}>
            - Uses {SIDEBAR_WIDTH}px width when expanded
          </Text>
        </View>
      </View>
    </View>
  );
}
