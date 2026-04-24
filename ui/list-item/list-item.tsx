import { type ReactElement, type ReactNode, forwardRef, useMemo } from 'react';
import {
  Image,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';

export type ListItemSize = 'sm' | 'md' | 'lg';

interface ListItemBaseProps extends ViewProps {
  size?: ListItemSize;
  title: string;
  subtitle?: string;
  leading?: ReactElement;
  leadingIcon?: ReactElement;
  leadingImage?: string;
  trailing?: ReactElement;
  trailingText?: string;
  showDivider?: boolean;
}

export interface ListItemProps extends ListItemBaseProps {
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  disabled?: boolean;
}

export interface ListItemSelectableProps extends ListItemBaseProps {
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
}

type ListItemComponent = React.FC<
  ListItemProps | (ListItemSelectableProps & { onPress?: never })
>;

const SIZE_CONFIG: Record<
  ListItemSize,
  {
    paddingVertical: number;
    paddingHorizontal: number;
    iconSize: number;
    titleSize: number;
    subtitleSize: number;
  }
> = {
  sm: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    iconSize: 20,
    titleSize: FontSizes.sm,
    subtitleSize: FontSizes.xs,
  },
  md: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    iconSize: 24,
    titleSize: FontSizes.base,
    subtitleSize: FontSizes.sm,
  },
  lg: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    iconSize: 32,
    titleSize: FontSizes.lg,
    subtitleSize: FontSizes.base,
  },
};

function useListItemColors() {
  const background = useThemeColor({
    light: Colors.light.background,
    dark: Colors.dark.background,
  });
  const foreground = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const mutedForeground = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const borderColor = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });
  const secondaryBg = useThemeColor({
    light: Colors.light.secondary,
    dark: Colors.dark.secondary,
  });
  const primary = useThemeColor({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });

  return {
    background,
    foreground,
    mutedForeground,
    borderColor,
    secondaryBg,
    primary,
  };
}

function isSelectable(
  props: ListItemProps | ListItemSelectableProps
): props is ListItemSelectableProps {
  return 'onSelect' in props;
}

export const ListItem: ListItemComponent = forwardRef<
  View,
  ListItemProps | ListItemSelectableProps
>((props, ref) => {
  const {
    size = 'md',
    title,
    subtitle,
    leading,
    leadingIcon,
    leadingImage,
    trailing,
    trailingText,
    showDivider = false,
    style,
    ...rest
  } = props;

  const {
    background,
    foreground,
    mutedForeground,
    borderColor,
    secondaryBg,
    primary,
  } = useListItemColors();

  const sizeConfig = SIZE_CONFIG[size];

  const isSelectableItem = isSelectable(props);
  const isSelected = isSelectableItem ? props.selected : false;
  const onSelect = isSelectableItem ? props.onSelect : undefined;
  const onPress = !isSelectableItem
    ? (props as ListItemProps).onPress
    : undefined;
  const onLongPress = !isSelectableItem
    ? (props as ListItemProps).onLongPress
    : undefined;
  const disabled = !isSelectableItem
    ? (props as ListItemProps).disabled
    : undefined;

  const handlePress: PressableProps['onPress'] = (event) => {
    if (onPress) {
      onPress(event);
    } else if (onSelect && isSelectableItem) {
      onSelect(!isSelected);
    }
  };

  const containerStyle = useMemo(() => {
    const baseStyles: object[] = [
      styles.container,
      {
        paddingVertical: sizeConfig.paddingVertical,
        paddingHorizontal: sizeConfig.paddingHorizontal,
        backgroundColor: background,
      },
    ];

    if (isSelected) {
      baseStyles.push({
        backgroundColor: secondaryBg,
      });
    }

    return baseStyles;
  }, [sizeConfig, background, isSelected, secondaryBg]);

  const leadingContainerStyle =
    leading || leadingIcon || leadingImage ? styles.leadingContainer : null;

  const contentContainerStyle = useMemo(() => {
    const hasTrailing = trailing || trailingText;
    return [styles.contentContainer, hasTrailing && { flex: 1 }];
  }, [trailing, trailingText]);

  const titleStyle = useMemo(
    () => [
      styles.title,
      {
        fontSize: sizeConfig.titleSize,
        color: foreground,
      },
    ],
    [sizeConfig, foreground]
  );

  const subtitleStyle = useMemo(
    () => [
      styles.subtitle,
      {
        fontSize: sizeConfig.subtitleSize,
        color: mutedForeground,
      },
    ],
    [sizeConfig, mutedForeground]
  );

  const trailingContainerStyle =
    trailing || trailingText ? styles.trailingContainer : null;

  const trailingTextStyle = useMemo(
    () => [
      styles.trailingText,
      {
        color: mutedForeground,
        fontSize: sizeConfig.subtitleSize,
      },
    ],
    [mutedForeground, sizeConfig]
  );

  const dividerStyle = useMemo(() => {
    if (!showDivider) return null;
    return [
      styles.divider,
      {
        borderBottomColor: borderColor,
        marginLeft:
          leading || leadingIcon || leadingImage
            ? sizeConfig.paddingHorizontal + sizeConfig.iconSize + Spacing[3]
            : sizeConfig.paddingHorizontal,
      },
    ];
  }, [
    showDivider,
    borderColor,
    leading,
    leadingIcon,
    leadingImage,
    sizeConfig,
  ]);

  const pressableContent = (
    <>
      {leading && (
        <View style={[leadingContainerStyle, { marginRight: Spacing[3] }]}>
          {leading}
        </View>
      )}
      {leadingIcon && (
        <View style={[leadingContainerStyle, { marginRight: Spacing[3] }]}>
          {leadingIcon}
        </View>
      )}
      {leadingImage && (
        <View style={[leadingContainerStyle, { marginRight: Spacing[3] }]}>
          <Image
            source={{ uri: leadingImage }}
            style={{
              width: sizeConfig.iconSize,
              height: sizeConfig.iconSize,
              borderRadius: Radius.full,
            }}
          />
        </View>
      )}
      <View style={contentContainerStyle}>
        <Text style={titleStyle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={subtitleStyle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
      {trailing && (
        <View style={[trailingContainerStyle, { marginLeft: Spacing[3] }]}>
          {trailing}
        </View>
      )}
      {trailingText && (
        <View style={[trailingContainerStyle, { marginLeft: Spacing[3] }]}>
          <Text style={trailingTextStyle}>{trailingText}</Text>
        </View>
      )}
      {dividerStyle && <View style={dividerStyle} />}
    </>
  );

  if (onPress || onSelect) {
    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        onLongPress={onLongPress}
        disabled={disabled}
        style={({ pressed }) => [
          containerStyle,
          pressed && { opacity: 0.7 },
          style,
        ]}
        {...rest}
      >
        {pressableContent}
      </Pressable>
    );
  }

  return (
    <View ref={ref} style={[containerStyle, style]} {...rest}>
      {pressableContent}
    </View>
  );
});

ListItem.displayName = 'ListItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '500',
  },
  subtitle: {
    marginTop: 2,
  },
  trailingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailingText: {
    fontWeight: '400',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
  },
});
