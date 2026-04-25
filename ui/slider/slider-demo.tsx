import { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, FontSizes, Radius, Spacing, useThemeColor } from '../theme';
import { Slider, type SliderRef } from './slider';

interface FormData {
  volume: number;
  brightness: number;
  contrast: number;
}

export function SliderDemo() {
  const [basicValue, setBasicValue] = useState(50);
  const [labelValue, setLabelValue] = useState(25);
  const [ranges, setRanges] = useState({
    small: 50,
    custom: 500,
    reverse: 50,
  });
  const [steps, setSteps] = useState({
    step1: 5,
    step5: 10,
    step10: 50,
  });
  const [disabledValue, setDisabledValue] = useState(30);
  const [formData, setFormData] = useState<FormData>({
    volume: 70,
    brightness: 80,
    contrast: 50,
  });
  const sliderRef = useRef<SliderRef | null>(null);

  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
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
        demoBox: {
          backgroundColor: cardBg,
          borderRadius: Radius.lg,
          padding: Spacing[4],
        },
        description: {
          fontSize: FontSizes.sm,
          color: sectionFg,
          marginTop: Spacing[1],
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
          gap: Spacing[2],
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
        sliderContainer: {
          marginTop: Spacing[2],
        },
      }),
    [sectionFg, cardBg, border]
  );

  const handleResetSlider = () => {
    sliderRef.current?.setValue(50);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Slider</Text>
        <View style={styles.demoBox}>
          <Slider value={basicValue} onValueChange={setBasicValue} />
        </View>
        <Text style={styles.description}>Value: {basicValue}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Label</Text>
        <View style={styles.demoBox}>
          <Slider
            label="Volume"
            value={labelValue}
            onValueChange={setLabelValue}
          />
        </View>
        <Text style={styles.description}>Current value: {labelValue}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Different Ranges</Text>
        <View style={styles.demoBox}>
          <Slider
            label="0-100 (default)"
            value={ranges.small}
            onValueChange={(v) => setRanges((p) => ({ ...p, small: v }))}
            min={0}
            max={100}
          />
        </View>
        <View style={styles.demoBox}>
          <Slider
            label="0-1000"
            value={ranges.custom}
            onValueChange={(v) => setRanges((p) => ({ ...p, custom: v }))}
            min={0}
            max={1000}
          />
        </View>
        <View style={styles.demoBox}>
          <Slider
            label="-50 to 50"
            value={ranges.reverse}
            onValueChange={(v) => setRanges((p) => ({ ...p, reverse: v }))}
            min={-50}
            max={50}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Steps</Text>
        <View style={styles.demoBox}>
          <Slider
            label="Step 1"
            value={steps.step1}
            onValueChange={(v) => setSteps((p) => ({ ...p, step1: v }))}
            step={1}
          />
        </View>
        <View style={styles.demoBox}>
          <Slider
            label="Step 5"
            value={steps.step5}
            onValueChange={(v) => setSteps((p) => ({ ...p, step5: v }))}
            min={0}
            max={100}
            step={5}
          />
        </View>
        <View style={styles.demoBox}>
          <Slider
            label="Step 10"
            value={steps.step10}
            onValueChange={(v) => setSteps((p) => ({ ...p, step10: v }))}
            min={0}
            max={100}
            step={10}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled</Text>
        <View style={styles.demoBox}>
          <Slider label="Disabled with value" value={disabledValue} disabled />
        </View>
        <View style={styles.demoBox}>
          <Slider label="Disabled at min" value={0} disabled />
        </View>
        <View style={styles.demoBox}>
          <Slider label="Disabled at max" value={100} disabled />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.demoBox}>
          <Slider size="sm" label="Small" value={50} onValueChange={() => {}} />
        </View>
        <View style={styles.demoBox}>
          <Slider
            size="md"
            label="Medium (default)"
            value={50}
            onValueChange={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Forms</Text>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Audio Settings</Text>
          <View style={styles.formGroup}>
            <Slider
              label="Master Volume"
              value={formData.volume}
              onValueChange={(v) => setFormData((p) => ({ ...p, volume: v }))}
              min={0}
              max={100}
              step={5}
            />
          </View>
          <View style={styles.formGroup}>
            <Slider
              label="Bass"
              value={formData.brightness}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, brightness: v }))
              }
              min={0}
              max={100}
              step={5}
            />
          </View>
          <View style={styles.formGroup}>
            <Slider
              label="Treble"
              value={formData.contrast}
              onValueChange={(v) => setFormData((p) => ({ ...p, contrast: v }))}
              min={0}
              max={100}
              step={5}
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Image Editor</Text>
          <View style={styles.formGroup}>
            <Slider
              label="Brightness"
              value={formData.brightness}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, brightness: v }))
              }
              min={0}
              max={200}
            />
          </View>
          <View style={styles.formGroup}>
            <Slider
              label="Contrast"
              value={formData.contrast}
              onValueChange={(v) => setFormData((p) => ({ ...p, contrast: v }))}
              min={0}
              max={200}
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Login</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
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
          <View style={styles.sliderContainer}>
            <Slider
              label="Session Duration"
              value={50}
              onValueChange={() => {}}
              min={0}
              max={100}
              step={25}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
