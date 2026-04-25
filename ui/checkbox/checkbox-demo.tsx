import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Checkbox, type CheckboxState } from './checkbox';

interface FormData {
  terms: CheckboxState;
  notifications: CheckboxState;
  marketing: CheckboxState;
  updates: CheckboxState;
}

export function CheckboxDemo() {
  const [states, setStates] = useState<Record<string, CheckboxState>>({
    checkbox1: 'checked',
    checkbox2: 'unchecked',
    checkbox3: 'indeterminate',
    disabledChecked: 'checked',
    disabledUnchecked: 'unchecked',
  });
  const [formData, setFormData] = useState<FormData>({
    terms: 'checked',
    notifications: 'unchecked',
    marketing: 'unchecked',
    updates: 'checked',
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
        description: {
          fontSize: FontSizes.sm,
          color: sectionFg,
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
        rememberRow: {
          marginTop: Spacing[2],
        },
      }),
    [sectionFg, cardBg, border]
  );

  const updateState = (key: string, checked: CheckboxState) => {
    setStates((prev) => ({ ...prev, [key]: checked }));
  };

  const updateForm = (key: keyof FormData, checked: CheckboxState) => {
    setFormData((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Checked / Unchecked</Text>
        <View style={styles.row}>
          <Checkbox
            checked={states.checkbox1}
            onCheckedChange={(c) => updateState('checkbox1', c)}
          />
          <Checkbox
            checked={states.checkbox2}
            onCheckedChange={(c) => updateState('checkbox2', c)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Label</Text>
        <View style={styles.row}>
          <Checkbox
            label="Accept terms"
            checked={states.checkbox1}
            onCheckedChange={(c) => updateState('checkbox1', c)}
          />
        </View>
        <View style={styles.row}>
          <Checkbox
            label="I agree to the terms and conditions"
            checked={states.checkbox2}
            onCheckedChange={(c) => updateState('checkbox2', c)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indeterminate</Text>
        <View style={styles.row}>
          <Checkbox
            label="Select all"
            checked={states.checkbox3}
            onCheckedChange={(c) => updateState('checkbox3', c)}
          />
        </View>
        <Text style={styles.description}>
          Use indeterminate state forselect all/none functionality
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled</Text>
        <View style={styles.row}>
          <Checkbox checked="checked" disabled label="Disabled checked" />
        </View>
        <View style={styles.row}>
          <Checkbox checked="unchecked" disabled label="Disabled unchecked" />
        </View>
        <View style={styles.row}>
          <Checkbox
            checked={states.disabledChecked}
            onCheckedChange={(c) => updateState('disabledChecked', c)}
            disabled
            label="Disabled interactive"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          <Checkbox size="sm" label="Small" />
        </View>
        <View style={styles.row}>
          <Checkbox size="md" label="Medium" />
        </View>
        <View style={styles.row}>
          <Checkbox size="lg" label="Large" />
        </View>
        <View style={styles.row}>
          <Checkbox size="sm" checked="unchecked" label="Small unchecked" />
          <Checkbox size="md" checked="unchecked" label="Medium unchecked" />
          <Checkbox size="lg" checked="unchecked" label="Large unchecked" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Forms</Text>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Preferences</Text>
          <View style={styles.formGroup}>
            <Checkbox
              checked={formData.terms}
              onCheckedChange={(c) => updateForm('terms', c)}
              label="I accept the terms of service"
            />
          </View>
          <View style={styles.formGroup}>
            <Checkbox
              checked={formData.notifications}
              onCheckedChange={(c) => updateForm('notifications', c)}
              label="Enable push notifications"
            />
          </View>
          <View style={styles.formGroup}>
            <Checkbox
              checked={formData.marketing}
              onCheckedChange={(c) => updateForm('marketing', c)}
              label="Receive marketing emails"
            />
          </View>
          <View style={styles.formGroup}>
            <Checkbox
              checked={formData.updates}
              onCheckedChange={(c) => updateForm('updates', c)}
              label="Get product updates"
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
          <View style={styles.rememberRow}>
            <Checkbox
              checked={formData.terms}
              onCheckedChange={(c) => updateForm('terms', c)}
              label="Remember me"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
