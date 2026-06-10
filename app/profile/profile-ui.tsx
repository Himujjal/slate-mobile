import { Avatar } from '@ui/avatar/avatar';
import { Button } from '@ui/button/button';
import { TextInput } from '@ui/text-input/text-input';
import { Text } from '@ui/text/text';
import { StyleSheet, View } from 'react-native';
import { useProfileState } from './profile-state';

export function ProfileScreenContent() {
  const { user, name, phone, isSaving, setName, setPhone, save } =
    useProfileState();

  if (!user) {
    return (
      <View style={styles.empty}>
        <Text variant="muted">No profile data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarRow}>
        <Avatar
          size="xl"
          src={user.avatarUrl ?? undefined}
          fallback={user.name}
        />
      </View>
      <TextInput label="Name" value={name} onChangeText={setName} />
      <TextInput label="Email" value={user.email ?? ''} editable={false} />
      <TextInput label="Phone" value={phone} onChangeText={setPhone} />
      <Button
        variant="filled"
        color="primary"
        loading={isSaving}
        onPress={save}
      >
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  avatarRow: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
});
