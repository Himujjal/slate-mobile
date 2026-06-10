import { Switch } from '@ui/switch/switch';
import { TextInput } from '@ui/text-input/text-input';
import { Text } from '@ui/text/text';
import { StyleSheet, View } from 'react-native';
import { useSettingsState } from './settings-state';

export function SettingsScreenContent() {
  const {
    theme,
    notifications,
    language,
    setTheme,
    setNotifications,
    setLanguage,
  } = useSettingsState();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Dark Mode</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
        />
      </View>
      <View style={styles.row}>
        <Text>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
      <TextInput label="Language" value={language} onChangeText={setLanguage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
