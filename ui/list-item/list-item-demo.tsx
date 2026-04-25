import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { ListItem } from './list-item';

export function ListItemDemo() {
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const mutedBg = useThemeColor({
    light: Colors.light.muted,
    dark: Colors.dark.muted,
  });
  const primary = useThemeColor({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });
  const primaryFg = useThemeColor({
    light: Colors.light.primaryForeground,
    dark: Colors.dark.primaryForeground,
  });
  const background = useThemeColor({
    light: Colors.light.background,
    dark: Colors.dark.background,
  });

  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>(
    {}
  );

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
          gap: Spacing[2],
        },
        iconContainer: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: primary,
          justifyContent: 'center',
          alignItems: 'center',
        },
        iconText: {
          color: primaryFg,
          fontSize: FontSizes.sm,
          fontWeight: '600',
        },
        badge: {
          paddingHorizontal: Spacing[2],
          paddingVertical: Spacing[1],
          borderRadius: Radius.sm,
          backgroundColor: primary,
        },
        badgeText: {
          color: primaryFg,
          fontSize: FontSizes.xs,
          fontWeight: '600',
        },
        chevron: {
          width: 10,
          height: 10,
          borderRightWidth: 2,
          borderBottomWidth: 2,
          borderColor: mutedFg,
          transform: [{ rotate: '-45deg' }],
        },
        checkbox: {
          width: 20,
          height: 20,
          borderRadius: Radius.sm,
          borderWidth: 2,
          borderColor: primary,
          justifyContent: 'center',
          alignItems: 'center',
        },
        checkboxChecked: {
          backgroundColor: primary,
        },
        checkmark: {
          color: primaryFg,
          fontSize: 12,
          fontWeight: '700',
        },
        switch: {
          width: 44,
          height: 24,
          borderRadius: Radius.full,
          backgroundColor: primary,
          padding: 2,
        },
        switchKnob: {
          width: 20,
          height: 20,
          borderRadius: Radius.full,
          backgroundColor: background,
        },
      }),
    [mutedFg, mutedBg, primary, primaryFg, background]
  );

  const handleSelect = (index: number) => (selected: boolean) => {
    setSelectedItems((prev) => ({ ...prev, [index]: selected }));
  };

  const leadingIcon = (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>A</Text>
    </View>
  );

  const trailingChevron = <View style={styles.chevron} />;

  const trailingCheckbox = (checked: boolean) => (
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );

  const trailingSwitch = (
    <View style={styles.switch}>
      <View style={styles.switchKnob} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic List Items</Text>
        <View style={styles.row}>
          <ListItem title="Single Line Item" />
          <ListItem
            title="Item with Description"
            subtitle="This is a secondary line of text"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Icons</Text>
        <View style={styles.row}>
          <ListItem title="Inbox" leadingIcon={leadingIcon} />
          <ListItem
            title="Starred"
            subtitle="Your starred items"
            leadingIcon={leadingIcon}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Images</Text>
        <View style={styles.row}>
          <ListItem
            title="John Doe"
            subtitle="john@example.com"
            leadingImage="https://i.pravatar.cc/150?img=1"
          />
          <ListItem
            title="Jane Smith"
            subtitle="jane@example.com"
            leadingImage="https://i.pravatar.cc/150?img=2"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Descriptions</Text>
        <View style={styles.row}>
          <ListItem
            title="Notifications"
            subtitle="Receive push notifications for new messages"
          />
          <ListItem
            title="Email Updates"
            subtitle="Get daily email summaries of your activity"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selectable</Text>
        <View style={styles.row}>
          <ListItem
            title="Option 1"
            selected={selectedItems[1]}
            onSelect={handleSelect(1)}
            trailing={trailingCheckbox(selectedItems[1])}
          />
          <ListItem
            title="Option 2"
            selected={selectedItems[2]}
            onSelect={handleSelect(2)}
            trailing={trailingCheckbox(selectedItems[2])}
          />
          <ListItem
            title="Option 3"
            selected={selectedItems[3]}
            onSelect={handleSelect(3)}
            trailing={trailingCheckbox(selectedItems[3])}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Trailing Elements</Text>
        <View style={styles.row}>
          <ListItem title="Settings" trailing={trailingChevron} />
          <ListItem
            title="Profile"
            subtitle="View your profile"
            trailing={trailingChevron}
          />
          <ListItem title="Notifications" trailing={trailingSwitch} />
          <ListItem title="Version" trailingText="1.0.0" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Different Sizes</Text>
        <View style={styles.row}>
          <ListItem size="sm" title="Small Item" subtitle="Compact size" />
          <ListItem size="md" title="Medium Item" subtitle="Default size" />
          <ListItem size="lg" title="Large Item" subtitle="Prominent size" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pressable</Text>
        <View style={styles.row}>
          <ListItem
            title="Click Me"
            subtitle="Tap to see press effect"
            onPress={() => {}}
            trailing={trailingChevron}
          />
          <ListItem
            title="Long Press Me"
            subtitle="Press and hold"
            onLongPress={() => {}}
            trailing={trailingChevron}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Dividers</Text>
        <View style={styles.row}>
          <ListItem title="First Item" showDivider />
          <ListItem title="Second Item" showDivider />
          <ListItem title="Third Item" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Complex Examples</Text>
        <View style={styles.row}>
          <ListItem
            title="Welcome"
            subtitle="Check out the new features"
            leadingImage="https://i.pravatar.cc/150?img=3"
            trailing={
              <View style={styles.badge}>
                <Text style={styles.badgeText}>New</Text>
              </View>
            }
          />
          <ListItem
            title="Messages"
            subtitle="3 unread messages"
            leadingIcon={leadingIcon}
            trailing={trailingChevron}
            showDivider
          />
          <ListItem
            title="Account"
            subtitle="john@example.com"
            leadingImage="https://i.pravatar.cc/150?img=4"
            trailingText="Active"
          />
        </View>
      </View>
    </View>
  );
}
