import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { ToastProvider, type ToastType, useToast } from './toast';

interface ToastDemoState {
  visible: boolean;
  type: ToastType;
  message: string;
}

function ToastController() {
  const { showToast } = useToast();
  const [state, setState] = useState<ToastDemoState>({
    visible: false,
    type: 'info',
    message: '',
  });

  const showInfoToast = () => {
    showToast({
      message: 'This is an info message',
      type: 'info',
      closable: true,
    });
  };

  const showSuccessToast = () => {
    showToast({
      message: 'Operation completed successfully!',
      type: 'success',
      closable: true,
      autoDismiss: 3000,
    });
  };

  const showWarningToast = () => {
    showToast({
      message: 'Please review your settings',
      type: 'warning',
      closable: true,
    });
  };

  const showErrorToast = () => {
    showToast({
      message: 'An error occurred while processing',
      type: 'error',
      closable: true,
    });
  };

  const showWithActions = () => {
    showToast({
      message: 'Do you want to save changes?',
      type: 'info',
      closable: true,
      actions: [
        {
          label: 'Cancel',
          onPress: () => console.log('Cancel pressed'),
        },
        {
          label: 'Save',
          onPress: () => console.log('Save pressed'),
        },
      ],
    });
  };

  const showAutoDismiss = () => {
    showToast({
      message: 'This toast will auto-dismiss in 3 seconds',
      type: 'success',
      closable: true,
      autoDismiss: 3000,
    });
  };

  const cardBg = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });
  const fg = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const primaryBg = useThemeColor({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });

  return (
    <ToastProvider>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Info Toast</Text>
          <View style={styles.row}>
            <View style={[styles.button, { backgroundColor: primaryBg }]}>
              <Text style={styles.buttonText} onPress={showInfoToast}>
                Show Info
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Success Toast</Text>
          <View style={styles.row}>
            <View style={[styles.button, { backgroundColor: '#22c55e' }]}>
              <Text style={styles.buttonText} onPress={showSuccessToast}>
                Show Success
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Warning Toast</Text>
          <View style={styles.row}>
            <View style={[styles.button, { backgroundColor: '#f59e0b' }]}>
              <Text style={styles.buttonText} onPress={showWarningToast}>
                Show Warning
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Error Toast</Text>
          <View style={styles.row}>
            <View
              style={[
                styles.button,
                { backgroundColor: Colors.light.destructive },
              ]}
            >
              <Text style={styles.buttonText} onPress={showErrorToast}>
                Show Error
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>With Actions</Text>
          <View style={styles.row}>
            <View style={[styles.button, { backgroundColor: primaryBg }]}>
              <Text style={styles.buttonText} onPress={showWithActions}>
                Show With Actions
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auto-Dismiss</Text>
          <View style={styles.row}>
            <View style={[styles.button, { backgroundColor: '#22c55e' }]}>
              <Text style={styles.buttonText} onPress={showAutoDismiss}>
                Show with 3s Auto-Dismiss
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ToastProvider>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <Text style={styles.heading}>{children}</Text>;
}

export function ToastDemo() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ToastController />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: Spacing[6],
    padding: Spacing[4],
  },
  container: {
    gap: Spacing[6],
  },
  section: {
    gap: Spacing[3],
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  button: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.md,
  },
  buttonText: {
    fontSize: FontSizes.base,
    color: '#ffffff',
    fontWeight: '600',
  },
  heading: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
  },
});
