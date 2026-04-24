import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../text/text';
import { Spacing } from '../theme';
import { Colors, useThemeColor } from '../theme';
import { Chip } from './chip';

export function ChipDemo() {
  const sectionBackground = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });
  const sectionBorder = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Section
        title="Default Chips"
        background={sectionBackground}
        borderColor={sectionBorder}
      >
        <View style={styles.chipGroup}>
          <Chip variant="filled" size="sm">
            Small
          </Chip>
          <Chip variant="filled" size="md">
            Medium
          </Chip>
        </View>
        <View style={styles.chipGroup}>
          <Chip variant="outlined" size="sm">
            Small
          </Chip>
          <Chip variant="outlined" size="md">
            Medium
          </Chip>
        </View>
      </Section>

      <Section
        title="Selected Chips"
        background={sectionBackground}
        borderColor={sectionBorder}
      >
        <Text variant="caption" style={styles.sectionDescription}>
          Toggle selection by pressing
        </Text>
        <View style={styles.chipGroup}>
          <ToggleChip variant="filled">Selected</ToggleChip>
          <ToggleChip variant="filled">Unselected</ToggleChip>
        </View>
        <View style={styles.chipGroup}>
          <ToggleChip variant="outlined">Selected</ToggleChip>
          <ToggleChip variant="outlined">Unselected</ToggleChip>
        </View>
      </Section>

      <Section
        title="Closable Chips"
        background={sectionBackground}
        borderColor={sectionBorder}
      >
        <Text variant="caption" style={styles.sectionDescription}>
          Press × to remove
        </Text>
        <View style={styles.chipGroup}>
          <Chip variant="filled" closable onClose={() => {}}>
            Removable
          </Chip>
          <Chip variant="outlined" closable onClose={() => {}}>
            Removable
          </Chip>
        </View>
      </Section>

      <Section
        title="Chip Groups"
        background={sectionBackground}
        borderColor={sectionBorder}
      >
        <Text variant="caption" style={styles.sectionDescription}>
          Select multiple options
        </Text>
        <View style={styles.chipGroup}>
          <ToggleChip variant="filled">React</ToggleChip>
          <ToggleChip variant="filled">TypeScript</ToggleChip>
          <ToggleChip variant="filled">React Native</ToggleChip>
        </View>
        <View style={styles.chipGroup}>
          <ToggleChip variant="outlined">iOS</ToggleChip>
          <ToggleChip variant="outlined">Android</ToggleChip>
          <ToggleChip variant="outlined">Web</ToggleChip>
        </View>
        <Text variant="caption" style={styles.sectionDescription}>
          With closable chips
        </Text>
        <ClosableChipGroup variant="filled" />
        <ClosableChipGroup variant="outlined" />
      </Section>

      <Section
        title="Sizes Comparison"
        background={sectionBackground}
        borderColor={sectionBorder}
      >
        <Text variant="caption" style={styles.sectionDescription}>
          Small vs Medium with both variants
        </Text>
        <View style={styles.column}>
          <View style={styles.chipGroup}>
            <Chip size="sm" variant="filled">
              Sm Filled
            </Chip>
            <Chip size="md" variant="filled">
              Md Filled
            </Chip>
          </View>
          <View style={styles.chipGroup}>
            <Chip size="sm" variant="outlined">
              Sm Outlined
            </Chip>
            <Chip size="md" variant="outlined">
              Md Outlined
            </Chip>
          </View>
        </View>
      </Section>

      <Section
        title="With onPress Handler"
        background={sectionBackground}
        borderColor={sectionBorder}
      >
        <Text variant="caption" style={styles.sectionDescription}>
          Chips can be interactive
        </Text>
        <View style={styles.chipGroup}>
          <InteractiveChip variant="filled">Tap me</InteractiveChip>
          <InteractiveChip variant="outlined">Tap me</InteractiveChip>
        </View>
      </Section>
    </ScrollView>
  );
}

function ToggleChip({
  variant = 'filled',
  children,
}: {
  variant?: 'filled' | 'outlined';
  children: string;
}) {
  const [selected, setSelected] = useState(false);

  return (
    <Chip
      variant={variant}
      selected={selected}
      onPress={() => setSelected(!selected)}
    >
      {children}
    </Chip>
  );
}

function ClosableChipGroup({
  variant = 'filled',
}: {
  variant?: 'filled' | 'outlined';
}) {
  const [chips, setChips] = useState(['JavaScript', 'Python', 'Go']);

  const removeChip = (chip: string) => {
    setChips(chips.filter((c) => c !== chip));
  };

  return (
    <View style={styles.chipGroup}>
      {chips.map((chip) => (
        <Chip
          key={chip}
          variant={variant}
          closable
          onClose={() => removeChip(chip)}
        >
          {chip}
        </Chip>
      ))}
    </View>
  );
}

function InteractiveChip({
  variant = 'filled',
  children,
}: {
  variant?: 'filled' | 'outlined';
  children: string;
}) {
  const [taps, setTaps] = useState(0);

  return (
    <Chip variant={variant} onPress={() => setTaps(taps + 1)}>
      {children} ({taps})
    </Chip>
  );
}

function Section({
  title,
  background,
  borderColor,
  children,
}: {
  title: string;
  background: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[styles.section, { backgroundColor: background, borderColor }]}
    >
      <Text variant="subtitle" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing[4],
    gap: Spacing[4],
  },
  section: {
    padding: Spacing[4],
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    marginBottom: Spacing[3],
  },
  sectionDescription: {
    marginBottom: Spacing[2],
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  column: {
    gap: Spacing[2],
  },
});
