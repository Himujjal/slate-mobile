import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../button/button';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Card } from './card';

export function CardDemo() {
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
        cardRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing[4],
        },
        contentCard: {
          minWidth: 200,
        },
        contentTitle: {
          fontSize: FontSizes.lg,
          fontWeight: '600',
          marginBottom: Spacing[2],
        },
        contentText: {
          fontSize: FontSizes.base,
          opacity: 0.8,
        },
        badge: {
          alignSelf: 'flex-start',
          paddingHorizontal: Spacing[2],
          paddingVertical: Spacing[1],
          borderRadius: Radius.sm,
          backgroundColor: Colors.light.primary,
          marginBottom: Spacing[2],
        },
        badgeText: {
          fontSize: FontSizes.xs,
          fontWeight: '600',
          color: Colors.light.primaryForeground,
        },
      }),
    [mutedFg, mutedBg]
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variants</Text>
        <View style={styles.cardRow}>
          <Card style={styles.contentCard}>
            <Text style={styles.contentTitle}>Default Card</Text>
            <Text style={styles.contentText}>
              This is a default card with a border and white background.
            </Text>
          </Card>
          <Card variant="filled" style={styles.contentCard}>
            <Text style={styles.contentTitle}>Filled Card</Text>
            <Text style={styles.contentText}>
              This is a filled card with no border and a secondary background.
            </Text>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Padding Sizes</Text>
        <View style={styles.cardRow}>
          <Card padding="none" style={styles.contentCard}>
            <Text style={styles.contentTitle}>No Padding</Text>
            <Text style={styles.contentText}>Content with no padding.</Text>
          </Card>
          <Card padding="sm" style={styles.contentCard}>
            <Text style={styles.contentTitle}>Small Padding</Text>
            <Text style={styles.contentText}>Content with small padding.</Text>
          </Card>
          <Card padding="md" style={styles.contentCard}>
            <Text style={styles.contentTitle}>Medium Padding</Text>
            <Text style={styles.contentText}>Content with medium padding.</Text>
          </Card>
          <Card padding="lg" style={styles.contentCard}>
            <Text style={styles.contentTitle}>Large Padding</Text>
            <Text style={styles.contentText}>Content with large padding.</Text>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Elevated Cards</Text>
        <View style={styles.cardRow}>
          <Card elevated style={styles.contentCard}>
            <Text style={styles.contentTitle}>Elevated Default</Text>
            <Text style={styles.contentText}>
              This card has a shadow for elevation.
            </Text>
          </Card>
          <Card variant="filled" elevated style={styles.contentCard}>
            <Text style={styles.contentTitle}>Elevated Filled</Text>
            <Text style={styles.contentText}>
              This filled card also has a shadow.
            </Text>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Interactive Elements</Text>
        <View style={styles.cardRow}>
          <Card elevated style={styles.contentCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>New</Text>
            </View>
            <Text style={styles.contentTitle}>Interactive Card</Text>
            <Text style={styles.contentText}>
              This card can contain interactive elements like buttons.
            </Text>
            <View style={{ marginTop: Spacing[3] }}>
              <Button size="sm">Learn More</Button>
            </View>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card List Group</Text>
        <View style={{ gap: Spacing[3] }}>
          <Card>
            <Text style={styles.contentTitle}>List Item 1</Text>
            <Text style={styles.contentText}>Description for item 1</Text>
          </Card>
          <Card>
            <Text style={styles.contentTitle}>List Item 2</Text>
            <Text style={styles.contentText}>Description for item 2</Text>
          </Card>
          <Card>
            <Text style={styles.contentTitle}>List Item 3</Text>
            <Text style={styles.contentText}>Description for item 3</Text>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Combinations</Text>
        <View style={styles.cardRow}>
          <Card
            variant="filled"
            padding="lg"
            elevated
            style={styles.contentCard}
          >
            <Text style={styles.contentTitle}>All Options</Text>
            <Text style={styles.contentText}>
              Filled, large padding, elevated.
            </Text>
          </Card>
          <Card padding="xl" style={styles.contentCard}>
            <Text style={styles.contentTitle}>Extra Large Padding</Text>
            <Text style={styles.contentText}>Great for hero card layouts.</Text>
          </Card>
          <Card variant="filled" padding="sm" style={styles.contentCard}>
            <Text style={styles.contentTitle}>Compact Filled</Text>
            <Text style={styles.contentText}>Good for tight spaces.</Text>
          </Card>
        </View>
      </View>
    </View>
  );
}
