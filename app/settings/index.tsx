import { Text } from '@ui/text/text';
import { StyleSheet, View } from 'react-native';
import { useSettingsState } from './settings-state';
import { SettingsScreenContent } from './settings-ui';

export default function SettingsScreen() {
  useSettingsState();

  return (
    <View style={styles.container}>
      <Text variant="title">Settings</Text>
      <SettingsScreenContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
});
