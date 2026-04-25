import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Image, type ImageResizeMode, type ImageSize } from './image';

const SAMPLE_IMAGE_URL =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';

const PLACEHOLDER_IMAGE_URL =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400';

const ERROR_IMAGE_URL = 'https://invalid-url-that-will-error.com/image.jpg';

export function ImageDemo() {
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const mutedBg = useThemeColor({
    light: Colors.light.muted,
    dark: Colors.dark.muted,
  });
  const destructive = useThemeColor({
    light: Colors.light.destructive,
    dark: Colors.dark.destructive,
  });
  const destructiveFg = useThemeColor({
    light: Colors.light.destructiveForeground,
    dark: Colors.dark.destructiveForeground,
  });

  const [imageError, setImageError] = useState(false);

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
        imageWrapper: {
          alignItems: 'center',
          gap: Spacing[1],
        },
        label: {
          fontSize: FontSizes.xs,
          color: mutedFg,
        },
        errorButton: {
          paddingHorizontal: Spacing[4],
          paddingVertical: Spacing[2],
          backgroundColor: destructive,
          borderRadius: Radius.md,
        },
        errorButtonText: {
          fontSize: FontSizes.sm,
          color: destructiveFg,
          fontWeight: '600',
        },
      }),
    [mutedFg, mutedBg, destructive, destructiveFg]
  );

  const sizes: ImageSize[] = ['sm', 'md', 'lg', 'xl'];
  const resizeModes: ImageResizeMode[] = ['cover', 'contain', 'fill'];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          {sizes.map((size) => (
            <View key={size} style={styles.imageWrapper}>
              <Image src={SAMPLE_IMAGE_URL} size={size} />
              <Text style={styles.label}>{size}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resize Modes</Text>
        <View style={styles.row}>
          {resizeModes.map((mode) => (
            <View key={mode} style={styles.imageWrapper}>
              <Image src={SAMPLE_IMAGE_URL} size="md" resizeMode={mode} />
              <Text style={styles.label}>{mode}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Dimensions</Text>
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            <Image src={SAMPLE_IMAGE_URL} width={120} height={80} />
            <Text style={styles.label}>120x80</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image src={SAMPLE_IMAGE_URL} width={80} height={120} />
            <Text style={styles.label}>80x120</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image src={SAMPLE_IMAGE_URL} width={100} height={100} />
            <Text style={styles.label}>100x100</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aspect Ratio</Text>
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            <Image src={SAMPLE_IMAGE_URL} aspectRatio={16 / 9} width={160} />
            <Text style={styles.label}>16:9</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image src={SAMPLE_IMAGE_URL} aspectRatio={4 / 3} width={160} />
            <Text style={styles.label}>4:3</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image src={SAMPLE_IMAGE_URL} aspectRatio={1} width={120} />
            <Text style={styles.label}>1:1</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Placeholder</Text>
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            <Image
              src={SAMPLE_IMAGE_URL}
              size="md"
              placeholderSrc={PLACEHOLDER_IMAGE_URL}
            />
            <Text style={styles.label}>With placeholder src</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image src={SAMPLE_IMAGE_URL} size="md" showPlaceholder={true} />
            <Text style={styles.label}>Loading state</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image src={SAMPLE_IMAGE_URL} size="md" showPlaceholder={false} />
            <Text style={styles.label}>No placeholder</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Error State</Text>
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            <Image src={ERROR_IMAGE_URL} size="md" showErrorFallback={true} />
            <Text style={styles.label}>Error fallback</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image src={ERROR_IMAGE_URL} size="md" showErrorFallback={false} />
            <Text style={styles.label}>No error fallback</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              src={ERROR_IMAGE_URL}
              size="md"
              showErrorFallback={true}
              errorFallbackText="Custom error"
            />
            <Text style={styles.label}>Custom error text</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rounded Images</Text>
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            <View style={{ borderRadius: Radius.sm, overflow: 'hidden' }}>
              <Image src={SAMPLE_IMAGE_URL} size="md" />
            </View>
            <Text style={styles.label}>sm radius</Text>
          </View>
          <View style={styles.imageWrapper}>
            <View style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
              <Image src={SAMPLE_IMAGE_URL} size="md" />
            </View>
            <Text style={styles.label}>lg radius</Text>
          </View>
          <View style={styles.imageWrapper}>
            <View style={{ borderRadius: Radius.full, overflow: 'hidden' }}>
              <Image src={SAMPLE_IMAGE_URL} size="md" />
            </View>
            <Text style={styles.label}>circular</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With External Wrapper</Text>
        <View style={styles.row}>
          <CardWrapper>
            <Image src={SAMPLE_IMAGE_URL} width={200} height={120} />
          </CardWrapper>
        </View>
      </View>
    </View>
  );
}

function CardWrapper({ children }: { children: React.ReactNode }) {
  const borderColor = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });
  const bg = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });

  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor,
        padding: Spacing[4],
      }}
    >
      {children}
    </View>
  );
}
