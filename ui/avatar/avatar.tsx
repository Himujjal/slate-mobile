import { forwardRef } from 'react';
import { Image, StyleSheet, Text, View, type ViewProps } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends Omit<ViewProps, 'style'> {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  fallback?: string;
  showStatus?: boolean;
  statusColor?: 'online' | 'offline' | 'busy' | 'away';
  style?: ViewProps['style'];
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const FONT_SIZE_MAP: Record<AvatarSize, number> = {
  sm: FontSizes.xs,
  md: FontSizes.sm,
  lg: FontSizes.lg,
  xl: FontSizes['2xl'],
};

const STATUS_SIZE_MAP: Record<AvatarSize, number> = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = forwardRef<View, AvatarProps>(
  (
    {
      size = 'md',
      src,
      alt = 'Avatar',
      fallback,
      showStatus = false,
      statusColor = 'online',
      ...props
    },
    ref
  ) => {
    const dimension = SIZE_MAP[size];
    const fontSize = FONT_SIZE_MAP[size];
    const statusSize = STATUS_SIZE_MAP[size];

    const backgroundColor = useThemeColor({
      light: Colors.light.muted,
      dark: Colors.dark.muted,
    });
    const foregroundColor = useThemeColor({
      light: Colors.light.mutedForeground,
      dark: Colors.dark.mutedForeground,
    });

    const statusColorMap: Record<string, string> = {
      online: '#22c55e',
      offline: '#71717a',
      busy: '#ef4444',
      away: '#f59e0b',
    };

    const initials = fallback ? getInitials(fallback) : undefined;

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          {
            width: dimension,
            height: dimension,
            borderRadius: Radius.full,
            backgroundColor,
          },
          props.style,
        ]}
        {...props}
      >
        {src ? (
          <Image
            source={{ uri: src }}
            style={{
              width: dimension,
              height: dimension,
              borderRadius: Radius.full,
            }}
          />
        ) : (
          <Text
            style={[
              styles.initials,
              {
                fontSize,
                color: foregroundColor,
                lineHeight: dimension,
              },
            ]}
          >
            {initials}
          </Text>
        )}
        {showStatus && (
          <View
            style={[
              styles.status,
              {
                width: statusSize,
                height: statusSize,
                borderRadius: statusSize / 2,
                backgroundColor: statusColorMap[statusColor],
                borderWidth: Math.max(2, statusSize / 4),
              },
            ]}
          />
        )}
      </View>
    );
  }
);

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '600',
    textAlign: 'center',
  },
  status: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
