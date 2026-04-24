import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Icon, type IconColor, type IconSize } from './icon';

const COMMON_ICONS = [
  { icon: '⭐', label: 'Star' },
  { icon: '❤️', label: 'Heart' },
  { icon: '👍', label: 'Thumbs Up' },
  { icon: '🔔', label: 'Bell' },
  { icon: '⚙️', label: 'Gear' },
  { icon: '📱', label: 'Phone' },
  { icon: '✉️', label: 'Mail' },
  { icon: '📁', label: 'Folder' },
  { icon: '🗑️', label: 'Trash' },
  { icon: '✏️', label: 'Edit' },
  { icon: '🔍', label: 'Search' },
  { icon: '⚠️', label: 'Warning' },
  { icon: '✅', label: 'Check' },
  { icon: '❌', label: 'Close' },
  { icon: '➕', label: 'Add' },
  { icon: '➖', label: 'Remove' },
];

export function IconDemo() {
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const mutedBg = useThemeColor({
    light: Colors.light.muted,
    dark: Colors.dark.muted,
  });
  const fg = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: Spacing[6],
          padding: Spacing[4],
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
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing[3],
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
        },
        iconGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing[2],
        },
        iconItem: {
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: mutedBg,
          borderRadius: Radius.md,
        },
        label: {
          fontSize: FontSizes.sm,
          color: fg,
          minWidth: 60,
        },
      }),
    [mutedFg, mutedBg, fg]
  );

  const sizes: IconSize[] = ['sm', 'md', 'lg', 'xl'];
  const colors: IconColor[] = [
    'primary',
    'muted',
    'destructive',
    'accent',
    'secondary',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        {sizes.map((size) => (
          <View key={size} style={styles.row}>
            <Text style={styles.label}>{size}</Text>
            <Icon icon="⭐" size={size} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors</Text>
        <View style={styles.row}>
          {colors.map((color) => (
            <Icon key={color} icon="★" color={color} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rotations</Text>
        <View style={styles.row}>
          <Icon icon="→" size="lg" rotation={0} />
          <Icon icon="→" size="lg" rotation={90} />
          <Icon icon="→" size="lg" rotation={180} />
          <Icon icon="→" size="lg" rotation={270} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Icons</Text>
        <View style={styles.row}>
          <View style={styles.iconGrid}>
            {COMMON_ICONS.map(({ icon, label }) => (
              <View key={label} style={styles.iconItem}>
                <Icon icon={icon} size="lg" />
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Context</Text>
        <View style={styles.row}>
          <Icon icon="❤️" color="destructive" />
          <Text style={[styles.label, { flex: 1 }]}>Like</Text>
          <Icon icon="🔄" color="muted" />
          <Icon icon="💾" color="accent" />
        </View>
      </View>
    </ScrollView>
  );
}
