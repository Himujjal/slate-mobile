import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { RadioButton, type RadioButtonSize, RadioGroup } from './radio-button';

interface FormData {
  plan: string;
  notification: string;
  color: string;
  language: string;
}

export function RadioButtonDemo() {
  const [standaloneChecked, setStandaloneChecked] = useState(false);
  const [labelChecked, setLabelChecked] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    plan: 'free',
    notification: 'email',
    color: 'blue',
    language: 'en',
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
        groupCard: {
          backgroundColor: cardBg,
          borderRadius: Radius.lg,
          padding: Spacing[4],
          gap: Spacing[3],
        },
        groupLabel: {
          fontSize: FontSizes.base,
          fontWeight: '600',
        },
        groupItems: {
          gap: Spacing[3],
        },
        selectedText: {
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
        preferenceLabel: {
          fontSize: FontSizes.base,
          fontWeight: '500',
          marginTop: Spacing[2],
        },
      }),
    [sectionFg, cardBg, border]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Standalone Radio</Text>
        <View style={styles.row}>
          <RadioButton checked={true} />
          <RadioButton checked={false} />
        </View>
        <View style={styles.row}>
          <RadioButton
            checked={standaloneChecked}
            onCheckedChange={setStandaloneChecked}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Label</Text>
        <View style={styles.row}>
          <RadioButton
            label="Option 1"
            checked={labelChecked}
            onCheckedChange={setLabelChecked}
          />
        </View>
        <View style={styles.row}>
          <RadioButton label="Select this option" checked={false} />
        </View>
        <View style={styles.row}>
          <RadioButton
            label="I agree to the terms and conditions"
            checked={true}
            onCheckedChange={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Groups</Text>
        <View style={styles.groupCard}>
          <Text style={styles.groupLabel}>Choose a plan</Text>
          <View style={styles.groupItems}>
            <RadioButton
              label="Free"
              checked={formData.plan === 'free'}
              onCheckedChange={() => setFormData({ ...formData, plan: 'free' })}
            />
            <RadioButton
              label="Pro ($9.99/mo)"
              checked={formData.plan === 'pro'}
              onCheckedChange={() => setFormData({ ...formData, plan: 'pro' })}
            />
            <RadioButton
              label="Enterprise"
              checked={formData.plan === 'enterprise'}
              onCheckedChange={() =>
                setFormData({ ...formData, plan: 'enterprise' })
              }
            />
          </View>
          <Text style={styles.selectedText}>Selected: {formData.plan}</Text>
        </View>

        <View style={styles.groupCard}>
          <Text style={styles.groupLabel}>Select color theme</Text>
          <View style={styles.groupItems}>
            <RadioButton
              label="Blue"
              value="blue"
              checked={formData.color === 'blue'}
              onCheckedChange={() =>
                setFormData({ ...formData, color: 'blue' })
              }
            />
            <RadioButton
              label="Green"
              value="green"
              checked={formData.color === 'green'}
              onCheckedChange={() =>
                setFormData({ ...formData, color: 'green' })
              }
            />
            <RadioButton
              label="Purple"
              value="purple"
              checked={formData.color === 'purple'}
              onCheckedChange={() =>
                setFormData({ ...formData, color: 'purple' })
              }
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled</Text>
        <View style={styles.row}>
          <RadioButton checked={true} disabled label="Disabled checked" />
        </View>
        <View style={styles.row}>
          <RadioButton checked={false} disabled label="Disabled unchecked" />
        </View>
        <View style={styles.row}>
          <RadioButton
            checked={false}
            onCheckedChange={() => {}}
            disabled
            label="Disabled interactive"
          />
        </View>
        <Text style={styles.description}>
          Disabled radio buttons cannot be interacted with
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          <RadioButton size="sm" label="Small" checked={true} />
        </View>
        <View style={styles.row}>
          <RadioButton size="md" label="Medium" checked={true} />
        </View>
        <View style={styles.row}>
          <RadioButton size="lg" label="Large" checked={true} />
        </View>
        <View style={styles.row}>
          <RadioButton size="sm" label="Small unchecked" checked={false} />
          <RadioButton size="md" label="Medium unchecked" checked={false} />
          <RadioButton size="lg" label="Large unchecked" checked={false} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Forms</Text>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Subscription Plan</Text>
          <View style={styles.formGroup}>
            <RadioButton
              label="Free Plan"
              value="free"
              checked={formData.plan === 'free'}
              onCheckedChange={() => setFormData({ ...formData, plan: 'free' })}
            />
          </View>
          <View style={styles.formGroup}>
            <RadioButton
              label="Pro Plan - $9.99/month"
              value="pro"
              checked={formData.plan === 'pro'}
              onCheckedChange={() => setFormData({ ...formData, plan: 'pro' })}
            />
          </View>
          <View style={styles.formGroup}>
            <RadioButton
              label="Enterprise - Custom pricing"
              value="enterprise"
              checked={formData.plan === 'enterprise'}
              onCheckedChange={() =>
                setFormData({ ...formData, plan: 'enterprise' })
              }
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Notification Settings</Text>
          <View style={styles.formGroup}>
            <RadioButton
              label="Email notifications"
              value="email"
              checked={formData.notification === 'email'}
              onCheckedChange={() =>
                setFormData({ ...formData, notification: 'email' })
              }
            />
          </View>
          <View style={styles.formGroup}>
            <RadioButton
              label="Push notifications"
              value="push"
              checked={formData.notification === 'push'}
              onCheckedChange={() =>
                setFormData({ ...formData, notification: 'push' })
              }
            />
          </View>
          <View style={styles.formGroup}>
            <RadioButton
              label="SMS notifications"
              value="sms"
              checked={formData.notification === 'sms'}
              onCheckedChange={() =>
                setFormData({ ...formData, notification: 'sms' })
              }
            />
          </View>
          <View style={styles.formGroup}>
            <RadioButton
              label="No notifications"
              value="none"
              checked={formData.notification === 'none'}
              onCheckedChange={() =>
                setFormData({ ...formData, notification: 'none' })
              }
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Profile Settings</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={mutedFg}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={mutedFg}
              keyboardType="email-address"
            />
          </View>
          <Text style={styles.preferenceLabel}>Language Preference</Text>
          <View style={styles.formGroup}>
            <RadioButton
              label="English"
              value="en"
              checked={formData.language === 'en'}
              onCheckedChange={() =>
                setFormData({ ...formData, language: 'en' })
              }
            />
          </View>
          <View style={styles.formGroup}>
            <RadioButton
              label="Spanish"
              value="es"
              checked={formData.language === 'es'}
              onCheckedChange={() =>
                setFormData({ ...formData, language: 'es' })
              }
            />
          </View>
          <View style={styles.formGroup}>
            <RadioButton
              label="French"
              value="fr"
              checked={formData.language === 'fr'}
              onCheckedChange={() =>
                setFormData({ ...formData, language: 'fr' })
              }
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
