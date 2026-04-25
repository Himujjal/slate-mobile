import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Fab, type FabColor, type FabSize } from './fab';

type FabItem = {
  icon?: string;
  label?: string;
  size?: FabSize;
  color?: FabColor;
};

const sections: {
  title: string;
  description: string;
  items: Array<FabItem>;
}[] = [
  {
    title: 'Sizes',
    description: 'Small, Medium, and Large FABs',
    items: [
      { size: 'sm', label: 'Small' },
      { size: 'md', label: 'Medium' },
      { size: 'lg', label: 'Large' },
    ],
  },
  {
    title: 'Colors',
    description: 'Primary, Secondary, and Destructive colors',
    items: [
      { color: 'primary', label: 'Primary' },
      { color: 'secondary', label: 'Secondary' },
      { color: 'destructive', label: 'Destructive' },
    ],
  },
  {
    title: 'With Icons',
    description: 'FABs with icons only (no label)',
    items: [
      { icon: '+', size: 'sm', color: 'primary' },
      { icon: '+', size: 'md', color: 'primary' },
      { icon: '+', size: 'lg', color: 'primary' },
    ],
  },
  {
    title: 'Extended FAB',
    description: 'FAB with label and icon',
    items: [
      { icon: '+', label: 'Create', size: 'sm', color: 'primary' },
      { icon: '+', label: 'Create', size: 'md', color: 'secondary' },
      { icon: '🗑️', label: 'Delete', size: 'md', color: 'destructive' },
    ],
  },
  {
    title: 'Extended Sizes',
    description: 'Extended FABs in different sizes',
    items: [
      { icon: '✓', label: 'Confirm', size: 'sm', color: 'primary' },
      { icon: '✓', label: 'Confirm', size: 'md', color: 'primary' },
      { icon: '✓', label: 'Confirm', size: 'lg', color: 'primary' },
    ],
  },
  {
    title: 'Positions',
    description: 'FAB positioned in different corners',
    items: [
      { icon: '+', size: 'md', color: 'primary' },
      { icon: '+', size: 'md', color: 'primary' },
      { icon: '+', size: 'md', color: 'primary' },
      { icon: '+', size: 'md', color: 'primary' },
    ],
  },
];

export function FabDemo() {
  const background = useThemeColor({
    light: Colors.light.background,
    dark: Colors.dark.background,
  });
  const foreground = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const cardBg = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: Spacing[4],
          backgroundColor: background,
        },
        section: {
          marginBottom: Spacing[8],
        },
        sectionTitle: {
          fontSize: FontSizes.xl,
          fontWeight: '700',
          marginBottom: Spacing[1],
          color: foreground,
        },
        sectionDescription: {
          fontSize: FontSizes.base,
          marginBottom: Spacing[4],
          color: mutedFg,
        },
        itemsRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing[4],
        },
        itemWrapper: {
          alignItems: 'center',
          gap: Spacing[2],
          padding: Spacing[2],
          backgroundColor: cardBg,
          borderRadius: Radius.lg,
          minWidth: 100,
        },
        itemLabel: {
          fontSize: FontSizes.sm,
          color: mutedFg,
          marginTop: Spacing[2],
        },
      }),
    [background, foreground, mutedFg, cardBg]
  );

  return (
    <ScrollView style={styles.container}>
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionDescription}>{section.description}</Text>
          <View style={styles.itemsRow}>
            {section.items.map((item, index) => {
              const key = `${section.title}-${index}`;
              const displaySize =
                'size' in item ? (item.size as FabSize | undefined) : undefined;
              const displayColor =
                'color' in item && !('size' in item)
                  ? (item.color as FabColor | undefined)
                  : undefined;
              return (
                <View key={key} style={styles.itemWrapper}>
                  {item.label ? (
                    <Fab
                      icon={item.icon}
                      label={item.label}
                      size={item.size}
                      color={item.color}
                    />
                  ) : (
                    <Fab icon={item.icon} size={item.size} color={item.color} />
                  )}
                  {displaySize && (
                    <Text style={styles.itemLabel}>{displaySize}</Text>
                  )}
                  {displayColor && !displaySize && (
                    <Text style={styles.itemLabel}>{displayColor}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
