import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Switch, type SwitchState } from './switch';

interface FormData {
  notifications: SwitchState;
  darkMode: SwitchState;
  location: SwitchState;
  sound: SwitchState;
}

export function SwitchDemo() {
  const [states, setStates] = useState<Record<string, SwitchState>>({
    switch1: true,
    switch2: false,
    switch3: true,
    disabledOn: true,
    disabledOff: false,
  });
  const [formData, setFormData] = useState<FormData>({
    notifications: true,
    darkMode: false,
    location: true,
    sound: true,
  });

  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const mutedBg = useThemeColor({
    light: Colors.light.muted,
    dark: Colors.dark.muted,
  });
  const sectionFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const cardBg = useThemeColor({
    light: Colors.light.card,
    dark: Colors.dark.card,
  });
  const border = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });

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
          color: sectionFg,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        row: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing[3],
        },
        formCard: {
          backgroundColor: cardBg,
          borderRadius: Radius.lg,
          padding: Spacing[4],
          gap: Spacing[3],
        },
        formTitle: {
          fontSize: FontSizes.lg,
          fontWeight: '600',
        },
        formGroup: {
          gap: Spacing[1],
        },
        inputContainer: {
          borderWidth: 1,
          borderColor: border,
          borderRadius: Radius.md,
        },
        input: {
          padding: Spacing[3],
          fontSize: FontSizes.base,
        },
        switchRow: {
          marginTop: Spacing[2],
        },
      }),
    [sectionFg, cardBg, border]
  );

  const updateState = (key: string, value: SwitchState) => {
    setStates((prev) => ({ ...prev, [key]: value }));
  };

  const updateForm = (key: keyof FormData, value: SwitchState) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>On / Off</Text>
        <View style={styles.row}>
          <Switch
            value={states.switch1}
            onValueChange={(v) => updateState('switch1', v)}
          />
          <Switch
            value={states.switch2}
            onValueChange={(v) => updateState('switch2', v)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Label</Text>
        <View style={styles.row}>
          <Switch
            label="Enable notifications"
            value={states.switch1}
            onValueChange={(v) => updateState('switch1', v)}
          />
        </View>
        <View style={styles.row}>
          <Switch
            label="Dark mode"
            value={states.switch2}
            onValueChange={(v) => updateState('switch2', v)}
          />
        </View>
        <View style={styles.row}>
          <Switch
            label="Allow location access"
            value={states.switch3}
            onValueChange={(v) => updateState('switch3', v)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled</Text>
        <View style={styles.row}>
          <Switch value={true} disabled label="Disabled on" />
        </View>
        <View style={styles.row}>
          <Switch value={false} disabled label="Disabled off" />
        </View>
        <View style={styles.row}>
          <Switch
            value={states.disabledOn}
            onValueChange={(v) => updateState('disabledOn', v)}
            disabled
            label="Disabled interactive"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          <Switch size="sm" label="Small on" value={true} />
        </View>
        <View style={styles.row}>
          <Switch size="md" label="Medium on" value={true} />
        </View>
        <View style={styles.row}>
          <Switch size="lg" label="Large on" value={true} />
        </View>
        <View style={styles.row}>
          <Switch size="sm" label="Small off" value={false} />
          <Switch size="md" label="Medium off" value={false} />
          <Switch size="lg" label="Large off" value={false} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Forms</Text>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Settings</Text>
          <View style={styles.formGroup}>
            <Switch
              value={formData.notifications}
              onValueChange={(v) => updateForm('notifications', v)}
              label="Push notifications"
            />
          </View>
          <View style={styles.formGroup}>
            <Switch
              value={formData.darkMode}
              onValueChange={(v) => updateForm('darkMode', v)}
              label="Dark mode"
            />
          </View>
          <View style={styles.formGroup}>
            <Switch
              value={formData.location}
              onValueChange={(v) => updateForm('location', v)}
              label="Location services"
            />
          </View>
          <View style={styles.formGroup}>
            <Switch
              value={formData.sound}
              onValueChange={(v) => updateForm('sound', v)}
              label="Sound effects"
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Login</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={mutedFg}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={mutedFg}
              secureTextEntry
            />
          </View>
          <View style={styles.switchRow}>
            <Switch
              value={formData.notifications}
              onValueChange={(v) => updateForm('notifications', v)}
              label="Remember me"
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Profile Privacy</Text>
          <View style={styles.formGroup}>
            <Switch
              value={formData.location}
              onValueChange={(v) => updateForm('location', v)}
              label="Show location on profile"
            />
          </View>
          <View style={styles.formGroup}>
            <Switch
              value={formData.sound}
              onValueChange={(v) => updateForm('sound', v)}
              label="Show activity status"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
