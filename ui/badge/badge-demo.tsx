import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Badge } from './badge';

export function BadgeDemo() {
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
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing[2],
        },
        gridItem: {
          backgroundColor: mutedBg,
          padding: Spacing[3],
          borderRadius: Radius.lg,
          minWidth: 100,
          alignItems: 'center',
        },
        label: {
          fontSize: FontSizes.xs,
          color: mutedFg,
          marginTop: Spacing[1],
        },
      }),
    [mutedFg, mutedBg]
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variants</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Badge variant="filled" color="primary">
              Filled
            </Badge>
            <Text style={styles.label}>filled, primary</Text>
          </View>
          <View style={styles.gridItem}>
            <Badge variant="outlined" color="primary">
              Outlined
            </Badge>
            <Text style={styles.label}>outlined, primary</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Badge color="primary">Primary</Badge>
            <Text style={styles.label}>primary</Text>
          </View>
          <View style={styles.gridItem}>
            <Badge color="secondary">Secondary</Badge>
            <Text style={styles.label}>secondary</Text>
          </View>
          <View style={styles.gridItem}>
            <Badge color="destructive">Destructive</Badge>
            <Text style={styles.label}>destructive</Text>
          </View>
          <View style={styles.gridItem}>
            <Badge color="muted">Muted</Badge>
            <Text style={styles.label}>muted</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Badge size="sm">Small</Badge>
            <Text style={styles.label}>sm</Text>
          </View>
          <View style={styles.gridItem}>
            <Badge size="md">Medium</Badge>
            <Text style={styles.label}>md</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Combinations</Text>
        <View style={styles.grid}>
          <Badge variant="filled" color="primary" size="sm">
            New
          </Badge>
          <Badge variant="filled" color="secondary" size="sm">
            beta
          </Badge>
          <Badge variant="filled" color="destructive" size="sm">
            -3
          </Badge>
          <Badge variant="outlined" color="primary" size="sm">
            Pro
          </Badge>
          <Badge variant="outlined" color="muted" size="sm">
            Archived
          </Badge>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Content</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Badge color="primary">3 NEW</Badge>
          </View>
          <View style={styles.gridItem}>
            <Badge variant="outlined" color="destructive">
              SOLD OUT
            </Badge>
          </View>
          <View style={styles.gridItem}>
            <Badge color="secondary">Version 2.0</Badge>
          </View>
        </View>
      </View>
    </View>
  );
}
