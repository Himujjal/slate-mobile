import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Skeleton, SkeletonGroup, type SkeletonShape } from './skeleton';

export function SkeletonDemo() {
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
  const cardBg = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });
  const borderColor = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });

  const shapeTypes: SkeletonShape[] = ['text', 'circle', 'rounded-rect'];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: Spacing[6],
          padding: Spacing[4],
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
          marginBottom: Spacing[2],
        },
        row: {
          backgroundColor: mutedBg,
          padding: Spacing[4],
          borderRadius: Radius.lg,
          gap: Spacing[4],
        },
        card: {
          backgroundColor: cardBg,
          borderWidth: 1,
          borderColor: borderColor,
          borderRadius: Radius.lg,
          padding: Spacing[4],
        },
        cardTitle: {
          fontSize: FontSizes.base,
          fontWeight: '600',
          color: fg,
          marginBottom: Spacing[3],
        },
        listItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing[3],
          paddingVertical: Spacing[2],
        },
        inline: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing[2],
        },
        circleRow: {
          flexDirection: 'row',
          gap: Spacing[3],
        },
      }),
    [mutedFg, mutedBg, cardBg, borderColor, fg]
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Different Shapes</Text>
        <View style={styles.row}>
          {shapeTypes.map((shape) => (
            <View key={shape} style={styles.inline}>
              <Skeleton
                shape={shape}
                width={60}
                height={shape === 'circle' ? 60 : undefined}
              />
              <Text style={{ color: fg, fontSize: FontSizes.sm }}>{shape}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skeleton Text Lines</Text>
        <View style={styles.card}>
          <Skeleton width="40%" height={20} shape="rounded-rect" />
          <View style={{ height: Spacing[2] }} />
          <Skeleton width="100%" />
          <View style={{ height: Spacing[1] }} />
          <Skeleton width="90%" />
          <View style={{ height: Spacing[1] }} />
          <Skeleton width="75%" last />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skeleton List</Text>
        <View style={styles.card}>
          <SkeletonGroup spacing={Spacing[3]}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.listItem}>
                <Skeleton shape="circle" width={48} height={48} />
                <View style={{ flex: 1, gap: Spacing[1] }}>
                  <Skeleton width="60%" height={14} shape="rounded-rect" />
                  <Skeleton width="40%" height={12} />
                </View>
              </View>
            ))}
          </SkeletonGroup>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Animation</Text>
        <View style={styles.row}>
          <View style={styles.inline}>
            <Text style={{ color: fg, fontSize: FontSizes.sm }}>Animated</Text>
            <Skeleton shape="circle" width={40} height={40} animated />
          </View>
          <View style={styles.inline}>
            <Text style={{ color: fg, fontSize: FontSizes.sm }}>Static</Text>
            <Skeleton shape="circle" width={40} height={40} animated={false} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Circle Sizes</Text>
        <View style={styles.row}>
          <View style={styles.circleRow}>
            <Skeleton shape="circle" width={24} height={24} />
            <Skeleton shape="circle" width={32} height={32} />
            <Skeleton shape="circle" width={48} height={48} />
            <Skeleton shape="circle" width={64} height={64} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Groups</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Profile</Text>
          <SkeletonGroup spacing={Spacing[3]}>
            <View style={styles.listItem}>
              <Skeleton shape="circle" width={56} height={56} />
              <View style={{ flex: 1, gap: Spacing[1] }}>
                <Skeleton width="50%" height={16} shape="rounded-rect" />
                <Skeleton width="30%" height={14} />
              </View>
            </View>
          </SkeletonGroup>
        </View>
        <View style={{ height: Spacing[3] }} />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Article Card</Text>
          <SkeletonGroup spacing={Spacing[2]}>
            <Skeleton width="100%" height={120} shape="rounded-rect" />
            <Skeleton width="70%" height={18} shape="rounded-rect" />
            <Skeleton width="100%" />
            <Skeleton width="85%" />
            <Skeleton width="60%" height={14} last />
          </SkeletonGroup>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Width/Height</Text>
        <View style={styles.row}>
          <View style={styles.inline}>
            <Skeleton width={120} height={80} shape="rounded-rect" />
            <Skeleton width={200} height={40} shape="rounded-rect" />
            <Skeleton width={100} height={100} shape="circle" />
          </View>
        </View>
      </View>

      <View style={{ height: Spacing[16] }} />
    </ScrollView>
  );
}
