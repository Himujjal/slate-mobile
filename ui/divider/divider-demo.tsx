import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import {
  Divider,
  type DividerLabelPosition,
  type DividerOrientation,
  type DividerSize,
} from './divider';

export function DividerDemo() {
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
          gap: Spacing[3],
        },
        box: {
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
          minHeight: 80,
        },
        boxVertical: {
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing[4],
        },
        item: {
          width: 40,
          height: 40,
          borderRadius: Radius.md,
          backgroundColor: Colors.light.primary,
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

  const sizes: DividerSize[] = ['sm', 'md', 'lg'];
  const orientations: DividerOrientation[] = ['horizontal', 'vertical'];
  const labelPositions: DividerLabelPosition[] = ['left', 'center', 'right'];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horizontal Divider</Text>
        <View style={styles.box}>
          <Text style={{ color: fg, marginBottom: Spacing[2] }}>
            Content above
          </Text>
          <Divider orientation="horizontal" />
          <Text style={{ color: fg, marginTop: Spacing[2] }}>
            Content below
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vertical Divider</Text>
        <View style={styles.boxVertical}>
          <View style={styles.item} />
          <Divider orientation="vertical" size="md" />
          <View style={styles.item} />
          <Divider orientation="vertical" size="md" />
          <View style={styles.item} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Label (Horizontal)</Text>
        <View style={styles.box}>
          <Divider orientation="horizontal" label="Or" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Label Positions</Text>
        <View style={styles.row}>
          {labelPositions.map((pos) => (
            <View key={pos} style={styles.box}>
              <Text
                style={{
                  color: fg,
                  marginBottom: Spacing[2],
                  fontSize: FontSizes.sm,
                }}
              >
                {pos}
              </Text>
              <Divider
                orientation="horizontal"
                label="Divider"
                labelPosition={pos}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          {sizes.map((s) => (
            <View key={s} style={[styles.box, { flex: 1 }]}>
              <Text
                style={{
                  color: fg,
                  marginBottom: Spacing[2],
                  fontSize: FontSizes.sm,
                }}
              >
                {s}
              </Text>
              <Divider orientation="horizontal" size={s} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vertical with Label</Text>
        <View style={styles.boxVertical}>
          <Text style={{ color: fg, fontSize: FontSizes.sm }}>Text</Text>
          <Divider orientation="vertical" label="|" size="md" />
          <Text style={{ color: fg, fontSize: FontSizes.sm }}>Text</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Props Reference</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>orientation</Text>
            <Text style={styles.propValue}>horizontal | vertical</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>size</Text>
            <Text style={styles.propValue}>sm | md | lg</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>label</Text>
            <Text style={styles.propValue}>string</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.propName}>labelPosition</Text>
            <Text style={styles.propValue}>left | center | right</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
