import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Button } from './button';

export function ButtonDemo() {
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const mutedBg = useThemeColor({
    light: Colors.light.muted,
    dark: Colors.dark.muted,
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
        row: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing[3],
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
        },
      }),
    [mutedFg, mutedBg]
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variants</Text>
        <View style={styles.row}>
          <Button variant="filled">Filled</Button>
          <Button variant="outlined">Outlined</Button>
        </View>
        <View style={styles.row}>
          <Button variant="text">Text</Button>
          <Button variant="ghost">Ghost</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors (Filled)</Text>
        <View style={styles.row}>
          <Button color="primary">Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="destructive">Destructive</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors (Outlined)</Text>
        <View style={styles.row}>
          <Button variant="outlined" color="primary">
            Primary
          </Button>
          <Button variant="outlined" color="secondary">
            Secondary
          </Button>
          <Button variant="outlined" color="destructive">
            Destructive
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors (Text)</Text>
        <View style={styles.row}>
          <Button variant="text" color="primary">
            Primary
          </Button>
          <Button variant="text" color="secondary">
            Secondary
          </Button>
          <Button variant="text" color="destructive">
            Destructive
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>States</Text>
        <View style={styles.row}>
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
        </View>
        <View style={styles.row}>
          <Button loading>Loading</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Combinations</Text>
        <View style={styles.row}>
          <Button variant="outlined" size="lg">
            Outlined Large
          </Button>
        </View>
        <View style={styles.row}>
          <Button variant="filled" loading>
            Loading Filled
          </Button>
        </View>
        <View style={styles.row}>
          <Button variant="text" disabled>
            Disabled Text
          </Button>
        </View>
      </View>
    </View>
  );
}
