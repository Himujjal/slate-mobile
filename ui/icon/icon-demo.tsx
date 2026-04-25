import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Icon, type IconColor, type IconSize } from './icon';

const EMOJI_ICONS = [
  { icon: '⭐', label: 'Star' },
  { icon: '❤️', label: 'Heart' },
  { icon: '👍', label: 'Thumbs Up' },
  { icon: '👎', label: 'Thumbs Down' },
  { icon: '🔔', label: 'Bell' },
  { icon: '⚙️', label: 'Gear' },
  { icon: '📱', label: 'Phone' },
  { icon: '✉️', label: 'Mail' },
  { icon: '📁', label: 'Folder' },
  { icon: '🗑️', label: 'Trash' },
  { icon: '✏️', label: 'Edit' },
  { icon: '🔍', label: 'Search' },
  { icon: '⚠️', label: 'Warning' },
  { icon: '✅', label: 'Check' },
  { icon: '❌', label: 'Close' },
  { icon: '➕', label: 'Add' },
  { icon: '➖', label: 'Remove' },
  { icon: '🔒', label: 'Lock' },
  { icon: '🔓', label: 'Unlock' },
  { icon: '👁️', label: 'Eye' },
  { icon: '🔎', label: 'Search' },
  { icon: '🏠', label: 'Home' },
  { icon: '⚡', label: 'Lightning' },
  { icon: '🔥', label: 'Fire' },
  { icon: '💎', label: 'Gem' },
  { icon: '🎯', label: 'Target' },
  { icon: '🏆', label: 'Trophy' },
  { icon: '💡', label: 'Lightbulb' },
  { icon: '📌', label: 'Pin' },
  { icon: '🔗', label: 'Link' },
  { icon: '⏰', label: 'Alarm' },
  { icon: '🕐', label: 'Time' },
  { icon: '📅', label: 'Calendar' },
  { icon: '👤', label: 'User' },
  { icon: '👥', label: 'Users' },
  { icon: '💬', label: 'Chat' },
  { icon: '📢', label: 'Speaker' },
  { icon: '🔊', label: 'Volume Up' },
  { icon: '🔈', label: 'Volume Down' },
  { icon: '📷', label: 'Camera' },
  { icon: '🎥', label: 'Video' },
  { icon: '🎵', label: 'Music' },
  { icon: '🎮', label: 'Game' },
  { icon: '🛒', label: 'Cart' },
  { icon: '💳', label: 'Card' },
  { icon: '📦', label: 'Package' },
  { icon: '🚚', label: 'Truck' },
  { icon: '✈️', label: 'Airplane' },
  { icon: '⭐️', label: 'Star' },
  { icon: '💯', label: 'Hundred' },
];

const ICON_NAMES = [
  'home',
  'home-outline',
  'settings',
  'settings-outline',
  'search',
  'search-outline',
  'person',
  'person-outline',
  'heart',
  'heart-outline',
  'star',
  'star-outline',
  'cart',
  'cart-outline',
  'chatbubble',
  'chatbubble-outline',
  'notifications',
  'notifications-outline',
  'call',
  'call-outline',
  'mail',
  'mail-outline',
  'lock-closed',
  'lock-closed-outline',
  'lock-open',
  'lock-open-outline',
  'eye',
  'eye-outline',
  'camera',
  'camera-outline',
  'videocam',
  'videocam-outline',
  'musical-note',
  'musical-notes',
  'cloud',
  'cloud-outline',
  'folder',
  'folder-outline',
  'document',
  'document-outline',
  'checkmark-circle',
  'checkmark-circle-outline',
  'close-circle',
  'close-circle-outline',
  'add-circle',
  'add-circle-outline',
  'remove-circle',
  'remove-circle-outline',
  'arrow-back',
  'arrow-forward',
  'chevron-back',
  'chevron-forward',
] as const;

export function IconDemo() {
  const [selectedSize, setSelectedSize] = useState<IconSize>('md');
  const [vectorIcons, setVectorIcons] = useState<
    typeof import('@expo/vector-icons/Ionicons') | null
  >(null);
  const [loading, setLoading] = useState(false);
  const mutedFg = useThemeColor({ light: '#6b7280', dark: '#9ca3af' });
  const mutedBg = useThemeColor({ light: '#f3f4f6', dark: '#374151' });
  const fg = useThemeColor({ light: '#111827', dark: '#f9fafb' });

  const loadVectorIcons = async () => {
    if (vectorIcons) return;
    setLoading(true);
    try {
      const module = await import('@expo/vector-icons/Ionicons');
      setVectorIcons(module);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: Spacing[4],
        },
        section: {
          gap: Spacing[4],
          marginBottom: Spacing[6],
        },
        sectionTitle: {
          fontSize: FontSizes.base,
          fontWeight: '600',
          color: mutedFg,
        },
        sizesRow: {
          flexDirection: 'row',
          gap: Spacing[2],
        },
        sizeButton: {
          paddingHorizontal: Spacing[4],
          paddingVertical: Spacing[2],
          borderRadius: Radius.md,
          backgroundColor: mutedBg,
        },
        sizeButtonActive: {
          backgroundColor: fg,
        },
        sizeLabel: {
          fontSize: FontSizes.sm,
          color: mutedFg,
        },
        sizeLabelActive: {
          color: mutedBg,
        },
        iconGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing[4],
        },
        iconItem: {
          width: 80,
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: mutedBg,
          borderRadius: Radius.lg,
        },
        iconLabel: {
          fontSize: FontSizes.xs,
          color: mutedFg,
          marginTop: Spacing[1],
        },
      }),
    [mutedFg, mutedBg, fg]
  );

  const SIZE_MAP: Record<IconSize, number> = {
    sm: 20,
    md: 28,
    lg: 36,
    xl: 44,
  };

  const sizes: IconSize[] = ['sm', 'md', 'lg', 'xl'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Size Selector</Text>
        <View style={styles.sizesRow}>
          {sizes.map((size) => (
            <Pressable
              key={size}
              style={[
                styles.sizeButton,
                selectedSize === size && styles.sizeButtonActive,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.sizeLabel,
                  selectedSize === size && styles.sizeLabelActive,
                ]}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emoji Icons (50)</Text>
        <View style={styles.iconGrid}>
          {EMOJI_ICONS.map((item) => (
            <View key={item.label} style={styles.iconItem}>
              <Icon icon={item.icon} size={selectedSize} />
              <Text style={styles.iconLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Pressable
          style={[styles.sizeButton, { alignSelf: 'flex-start' }]}
          onPress={loadVectorIcons}
          disabled={!!vectorIcons || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={mutedFg} />
          ) : (
            <Text style={styles.sizeLabel}>
              {vectorIcons ? 'Loaded' : 'Load Vector Icons'}
            </Text>
          )}
        </Pressable>
      </View>

      {vectorIcons && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vector Icons - Ionicons (50)</Text>
          <View style={styles.iconGrid}>
            {ICON_NAMES.map((name) => {
              const IconComponent = vectorIcons.default;
              return (
                <View key={name} style={styles.iconItem}>
                  <IconComponent
                    name={name as never}
                    size={SIZE_MAP[selectedSize]}
                    color={fg}
                  />
                  <Text style={styles.iconLabel}>{name}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
