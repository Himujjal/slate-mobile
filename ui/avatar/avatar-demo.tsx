import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Avatar, type AvatarSize } from './avatar';

export function AvatarDemo() {
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

  const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl'];

  const demoImage =
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face';

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
          alignItems: 'center',
          gap: Spacing[3],
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
        },
        avatarRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing[4],
        },
        label: {
          fontSize: FontSizes.sm,
          color: fg,
          minWidth: 60,
        },
      }),
    [mutedFg, mutedBg, fg]
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        {sizes.map((size) => (
          <View key={size} style={styles.row}>
            <Text style={styles.label}>{size}</Text>
            <View style={styles.avatarRow}>
              <Avatar size={size} fallback="John Doe" />
              <Avatar size={size} src={demoImage} alt="Jane Smith" />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Image</Text>
        <View style={styles.row}>
          <Avatar size="lg" src={demoImage} alt="Profile picture" />
          <Avatar
            size="lg"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            alt="Another profile"
          />
          <Avatar
            size="lg"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
            alt="Third profile"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Initials Fallback</Text>
        <View style={styles.row}>
          <Avatar size="lg" fallback="Alice Johnson" />
          <Avatar size="lg" fallback="Bob Smith" />
          <Avatar size="lg" fallback="Charlie Brown" />
        </View>
        <View style={styles.row}>
          <Avatar size="lg" fallback="Single" />
          <Avatar size="lg" fallback="A" />
          <Avatar size="lg" fallback="" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Indicators</Text>
        <View style={styles.row}>
          <Avatar size="lg" fallback="Online" showStatus statusColor="online" />
          <Avatar
            size="lg"
            fallback="Offline"
            showStatus
            statusColor="offline"
          />
          <Avatar size="lg" fallback="Busy" showStatus statusColor="busy" />
          <Avatar size="lg" fallback="Away" showStatus statusColor="away" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status on Different Sizes</Text>
        {sizes.map((size) => (
          <View key={size} style={styles.row}>
            <Text style={styles.label}>{size}</Text>
            <Avatar size={size} fallback="User" showStatus />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image with Status</Text>
        <View style={styles.row}>
          <Avatar
            size="lg"
            src={demoImage}
            alt="Profile with status"
            showStatus
            statusColor="online"
          />
          <Avatar
            size="lg"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            alt="Another profile with status"
            showStatus
            statusColor="busy"
          />
        </View>
      </View>
    </ScrollView>
  );
}
