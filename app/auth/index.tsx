import { View } from 'react-native';
import { AuthUI } from './auth-ui';

export default function AuthScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AuthUI />
    </View>
  );
}
