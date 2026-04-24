import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { TextInput } from './text-input';

export function TextInputDemo() {
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
          <TextInput variant="outlined" placeholder="Outlined" />
        </View>
        <View style={styles.row}>
          <TextInput variant="filled" placeholder="Filled" />
        </View>
        <View style={styles.row}>
          <TextInput variant="ghost" placeholder="Ghost" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          <TextInput size="sm" placeholder="Small" />
        </View>
        <View style={styles.row}>
          <TextInput size="md" placeholder="Medium" />
        </View>
        <View style={styles.row}>
          <TextInput size="lg" placeholder="Large" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Label</Text>
        <View style={styles.row}>
          <TextInput label="Email" placeholder="Enter email" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Error</Text>
        <View style={styles.row}>
          <TextInput
            label="Password"
            placeholder="Enter password"
            error="Password must be at least 8 characters"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>States</Text>
        <View style={styles.row}>
          <TextInput placeholder="Default" />
        </View>
        <View style={styles.row}>
          <TextInput placeholder="Disabled" disabled />
        </View>
        <View style={styles.row}>
          <TextInput placeholder="With text" defaultValue="Hello World" />
        </View>
      </View>
    </View>
  );
}
