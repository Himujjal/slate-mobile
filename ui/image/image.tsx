import { Image as ExpoImage } from 'expo-image';
import { forwardRef, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  type ImageProps as RNImageProps,
  StyleSheet,
  Text,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, useThemeColor } from '../theme';

export type ImageResizeMode = 'cover' | 'contain' | 'fill';
export type ImageSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ImageProps extends Omit<ViewProps, 'style'> {
  src?: string;
  alt?: string;
  resizeMode?: ImageResizeMode;
  size?: ImageSize;
  width?: number;
  height?: number;
  aspectRatio?: number;
  showPlaceholder?: boolean;
  placeholderSrc?: string;
  showErrorFallback?: boolean;
  errorFallbackText?: string;
  style?: ViewStyle;
}

const SIZE_MAP: Record<ImageSize, number> = {
  sm: 64,
  md: 128,
  lg: 192,
  xl: 256,
};

const RESIZE_MODE_MAP: Record<ImageResizeMode, 'cover' | 'contain' | 'fill'> = {
  cover: 'cover',
  contain: 'contain',
  fill: 'fill',
};

function getSizeStyles(size?: ImageSize, width?: number, height?: number) {
  if (width || height) {
    return {
      width: width,
      height: height,
    };
  }
  if (size) {
    const dimension = SIZE_MAP[size];
    return {
      width: dimension,
      height: dimension,
    };
  }
  return {};
}

export const Image = forwardRef<View, ImageProps>(
  (
    {
      src,
      alt = 'Image',
      resizeMode = 'cover',
      size,
      width,
      height,
      aspectRatio,
      showPlaceholder = true,
      placeholderSrc,
      showErrorFallback = true,
      errorFallbackText,
      style,
      ...props
    },
    ref
  ) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const backgroundColor = useThemeColor({
      light: Colors.light.muted,
      dark: Colors.dark.muted,
    });
    const foregroundColor = useThemeColor({
      light: Colors.light.mutedForeground,
      dark: Colors.dark.mutedForeground,
    });

    const onLoadStart = useCallback(() => {
      setLoading(true);
      setError(false);
    }, []);

    const onLoadEnd = useCallback(() => {
      setLoading(false);
    }, []);

    const onError = useCallback(() => {
      setLoading(false);
      setError(true);
    }, []);

    const sizeStyles = getSizeStyles(size, width, height);

    const containerStyle: ViewStyle[] = [
      styles.container,
      backgroundColor ? { backgroundColor } : null,
      aspectRatio ? { aspectRatio } : null,
      sizeStyles,
      style,
    ].filter(Boolean) as ViewStyle[];

    const hasContent = src && !error;

    return (
      <View ref={ref} style={containerStyle} {...props}>
        {hasContent ? (
          <ExpoImage
            source={{ uri: src }}
            style={styles.image}
            contentFit={RESIZE_MODE_MAP[resizeMode]}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            onError={onError}
            alt={alt}
          />
        ) : (
          <>
            {showPlaceholder && placeholderSrc && !error && (
              <ExpoImage
                source={{ uri: placeholderSrc }}
                style={styles.image}
                contentFit={RESIZE_MODE_MAP[resizeMode]}
                alt={`${alt} placeholder`}
              />
            )}
            {showPlaceholder && !placeholderSrc && !error && loading && (
              <View style={[styles.placeholder, { backgroundColor }]}>
                <ActivityIndicator size="small" color={foregroundColor} />
              </View>
            )}
            {showErrorFallback && error && (
              <View style={[styles.errorFallback, { backgroundColor }]}>
                <Text style={[styles.errorText, { color: foregroundColor }]}>
                  {errorFallbackText || 'Failed to load image'}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  }
);

Image.displayName = 'Image';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[4],
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
