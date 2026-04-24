import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../button/button';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { BottomSheet } from './bottom-sheet';

export function BottomSheetDemo() {
  const [basicVisible, setBasicVisible] = useState(false);
  const [dragHandleVisible, setDragHandleVisible] = useState(false);
  const [snapPointsVisible, setSnapPointsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const mutedBg = useThemeColor({
    light: Colors.light.muted,
    dark: Colors.dark.muted,
  });
  const cardFg = useThemeColor({
    light: Colors.light.cardForeground,
    dark: Colors.dark.cardForeground,
  });

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Bottom Sheet</Text>
        <Text style={styles.description}>
          A simple bottom sheet with default settings
        </Text>
        <Button onPress={() => setBasicVisible(true)}>Open Basic Sheet</Button>
        <BottomSheet
          visible={basicVisible}
          onVisibleChange={setBasicVisible}
          title="Basic Bottom Sheet"
        >
          <Text style={styles.contentText}>
            This is a basic bottom sheet with a title and some content.
          </Text>
        </BottomSheet>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Drag Handle</Text>
        <Text style={styles.description}>
          Bottom sheet with drag handle visible
        </Text>
        <Button onPress={() => setDragHandleVisible(true)}>
          Open With Handle
        </Button>
        <BottomSheet
          visible={dragHandleVisible}
          onVisibleChange={setDragHandleVisible}
          title="Drag Handle Sheet"
          showDragHandle={true}
        >
          <Text style={styles.contentText}>
            This bottom sheet has a visible drag handle at the top.
          </Text>
          <Text style={styles.contentText}>
            Users can see where to drag to close.
          </Text>
        </BottomSheet>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Different Snap Points</Text>
        <Text style={styles.description}>
          Sheets with different height snap points
        </Text>
        <View style={styles.buttonGroup}>
          <Button onPress={() => setSnapPointsVisible(true)} size="sm">
            Open 50% Height
          </Button>
        </View>
        <BottomSheet
          visible={snapPointsVisible}
          onVisibleChange={setSnapPointsVisible}
          title="50% Height Sheet"
          snapPoints={['50%']}
        >
          <Text style={styles.contentText}>
            This bottom sheet takes up 50% of the screen height.
          </Text>
          <View style={styles.spacer} />
          <Text style={styles.contentText}>
            Snap points can be specified as percentages or pixels.
          </Text>
          <View style={styles.spacer} />
          <Text style={styles.contentText}>
            Try adjusting the content to see how it fills the space.
          </Text>
        </BottomSheet>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Content</Text>
        <Text style={styles.description}>
          Bottom sheet with rich content and actions
        </Text>
        <Button onPress={() => setContentVisible(true)}>
          Open Content Sheet
        </Button>
        <BottomSheet
          visible={contentVisible}
          onVisibleChange={setContentVisible}
          title="Share Options"
          snapPoints={['40%']}
        >
          <View style={styles.contentOption}>
            <View style={[styles.optionIcon, { backgroundColor: mutedBg }]}>
              <Text style={{ fontSize: 24 }}>📧</Text>
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Email</Text>
              <Text style={styles.optionDesc}>Share via email</Text>
            </View>
          </View>
          <View style={styles.contentOption}>
            <View style={[styles.optionIcon, { backgroundColor: mutedBg }]}>
              <Text style={{ fontSize: 24 }}>💬</Text>
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Messages</Text>
              <Text style={styles.optionDesc}>Share via messages</Text>
            </View>
          </View>
          <View style={styles.contentOption}>
            <View style={[styles.optionIcon, { backgroundColor: mutedBg }]}>
              <Text style={{ fontSize: 24 }}>📋</Text>
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Copy Link</Text>
              <Text style={styles.optionDesc}>Copy to clipboard</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <Button variant="outlined" onPress={() => setContentVisible(false)}>
              Cancel
            </Button>
          </View>
        </BottomSheet>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing[8],
  },
  section: {
    gap: Spacing[3],
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: FontSizes.base,
    opacity: 0.7,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  contentText: {
    fontSize: FontSizes.base,
    lineHeight: 24,
  },
  spacer: {
    height: Spacing[4],
  },
  contentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    gap: Spacing[4],
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FontSizes.base,
    fontWeight: '500',
  },
  optionDesc: {
    fontSize: FontSizes.sm,
    opacity: 0.7,
  },
  actionButtons: {
    marginTop: Spacing[4],
  },
});
