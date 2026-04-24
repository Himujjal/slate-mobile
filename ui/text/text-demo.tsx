import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Text as ThemedText } from './text';

export function TextDemo() {
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
        row: {
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
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
          flex: 1,
          fontSize: FontSizes.sm,
          fontFamily: 'monospace',
          color: fg,
        },
        propValue: {
          flex: 1,
          fontSize: FontSizes.sm,
          color: mutedFg,
        },
      }),
    [mutedFg, mutedBg, fg]
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variants</Text>
        <View style={styles.row}>
          <ThemedText variant="default">Default text</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="muted">Muted text</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="title">Title text</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="subtitle">Subtitle text</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="caption">Caption text</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes Reference</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>default</Text>
            <Text style={styles.propValue}>{FontSizes.base}px</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>muted</Text>
            <Text style={styles.propValue}>{FontSizes.base}px</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>title</Text>
            <Text style={styles.propValue}>{FontSizes['2xl']}px, bold</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>subtitle</Text>
            <Text style={styles.propValue}>{FontSizes.xl}px, semibold</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>caption</Text>
            <Text style={styles.propValue}>{FontSizes.sm}px</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
