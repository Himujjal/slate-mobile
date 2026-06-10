import { Text } from '@ui/text/text';
import { StyleSheet, View } from 'react-native';
import { useProfileState } from './profile-state';
import { ProfileScreenContent } from './profile-ui';

export default function ProfileScreen() {
  useProfileState();

  return (
    <View style={styles.container}>
      <Text variant="title">Profile</Text>
      <ProfileScreenContent />
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
