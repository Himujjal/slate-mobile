import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../button/button';
import { useThemeColor } from '../theme';
import { Colors, FontSizes, Radius, Spacing } from '../theme';
import { Modal } from './modal';

export function ModalDemo() {
  const [basicVisible, setBasicVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [sizesVisible, setSizesVisible] = useState<string | null>(null);
  const [closableVisible, setClosableVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState({ username: '', email: '' });

  const mutedFg = useThemeColor({
    light: Colors.light.mutedForeground,
    dark: Colors.dark.mutedForeground,
  });
  const mutedBg = useThemeColor({
    light: Colors.light.muted,
    dark: Colors.dark.muted,
  });

  const openModal = useCallback((modal: string) => {
    switch (modal) {
      case 'basic':
        setBasicVisible(true);
        break;
      case 'title':
        setTitleVisible(true);
        break;
      case 'actions':
        setActionsVisible(true);
        break;
      case 'sm':
      case 'md':
      case 'lg':
        setSizesVisible(modal);
        break;
      case 'closable':
        setClosableVisible(true);
        break;
      case 'form':
        setFormVisible(true);
        break;
    }
  }, []);

  const closeModal = useCallback(() => {
    setBasicVisible(false);
    setTitleVisible(false);
    setActionsVisible(false);
    setSizesVisible(null);
    setClosableVisible(false);
    setFormVisible(false);
  }, []);

  const handleAction = useCallback(
    (action: string) => {
      console.log('Action pressed:', action);
      closeModal();
    },
    [closeModal]
  );

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
        formContainer: {
          gap: Spacing[3],
        },
        label: {
          fontSize: FontSizes.sm,
          color: mutedFg,
          fontWeight: '500',
        },
        input: {
          borderWidth: 1,
          borderColor: Colors.light.border,
          borderRadius: Radius.md,
          padding: Spacing[3],
          fontSize: FontSizes.base,
        },
        formFooter: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: Spacing[2],
          marginTop: Spacing[2],
        },
      }),
    [mutedFg, mutedBg]
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Modal</Text>
        <View style={styles.row}>
          <Button onPress={() => openModal('basic')}>Open Basic Modal</Button>
        </View>
        <Modal visible={basicVisible} onClose={closeModal}>
          <Text
            style={{
              color: useThemeColor({
                light: Colors.light.foreground,
                dark: Colors.dark.foreground,
              }),
            }}
          >
            This is a basic modal with just content.
          </Text>
        </Modal>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Title</Text>
        <View style={styles.row}>
          <Button onPress={() => openModal('title')}>Open With Title</Button>
        </View>
        <Modal visible={titleVisible} title="Modal Title" onClose={closeModal}>
          <Text
            style={{
              color: useThemeColor({
                light: Colors.light.foreground,
                dark: Colors.dark.foreground,
              }),
            }}
          >
            This modal has a title in the header.
          </Text>
        </Modal>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Actions</Text>
        <View style={styles.row}>
          <Button onPress={() => openModal('actions')}>
            Open With Actions
          </Button>
        </View>
        <Modal
          visible={actionsVisible}
          title="Confirm Action"
          closable
          onClose={closeModal}
          actions={[
            { label: 'Cancel', onPress: () => handleAction('cancel') },
            {
              label: 'Confirm',
              onPress: () => handleAction('confirm'),
              variant: 'filled',
            },
          ]}
        >
          <Text
            style={{
              color: useThemeColor({
                light: Colors.light.foreground,
                dark: Colors.dark.foreground,
              }),
            }}
          >
            Are you sure you want to proceed with this action?
          </Text>
        </Modal>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Different Sizes</Text>
        <View style={styles.row}>
          <Button size="sm" onPress={() => openModal('sm')}>
            Small
          </Button>
          <Button size="sm" onPress={() => openModal('md')}>
            Medium
          </Button>
          <Button size="sm" onPress={() => openModal('lg')}>
            Large
          </Button>
        </View>
        <Modal
          visible={sizesVisible === 'sm'}
          title="Small Modal"
          size="sm"
          onClose={closeModal}
        >
          <Text
            style={{
              color: useThemeColor({
                light: Colors.light.foreground,
                dark: Colors.dark.foreground,
              }),
            }}
          >
            Small size - 280px width
          </Text>
        </Modal>
        <Modal
          visible={sizesVisible === 'md'}
          title="Medium Modal"
          size="md"
          onClose={closeModal}
        >
          <Text
            style={{
              color: useThemeColor({
                light: Colors.light.foreground,
                dark: Colors.dark.foreground,
              }),
            }}
          >
            Medium size - 340px width
          </Text>
        </Modal>
        <Modal
          visible={sizesVisible === 'lg'}
          title="Large Modal"
          size="lg"
          onClose={closeModal}
        >
          <Text
            style={{
              color: useThemeColor({
                light: Colors.light.foreground,
                dark: Colors.dark.foreground,
              }),
            }}
          >
            Large size - 420px width
          </Text>
        </Modal>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Closable</Text>
        <View style={styles.row}>
          <Button onPress={() => openModal('closable')}>Closable Modal</Button>
        </View>
        <Modal
          visible={closableVisible}
          title="Closable Modal"
          closable
          onClose={closeModal}
        >
          <Text
            style={{
              color: useThemeColor({
                light: Colors.light.foreground,
                dark: Colors.dark.foreground,
              }),
            }}
          >
            Click the × button or press outside to close this modal.
          </Text>
        </Modal>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Form Inside Modal</Text>
        <View style={styles.row}>
          <Button onPress={() => openModal('form')}>Form Modal</Button>
        </View>
        <Modal
          visible={formVisible}
          title="User Information"
          closable
          onClose={closeModal}
          actions={[
            { label: 'Cancel', onPress: closeModal },
            {
              label: 'Submit',
              onPress: () => handleAction('submit'),
              variant: 'filled',
              disabled: !formData.username || !formData.email,
            },
          ]}
        >
          <View style={styles.formContainer}>
            <View>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={formData.username}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, username: text }))
                }
              />
            </View>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
