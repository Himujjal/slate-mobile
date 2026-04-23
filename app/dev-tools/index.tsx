import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function DevToolsIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dev Tools</Text>
      <Link href="/dev-tools/flux-test" style={styles.link}>
        Flux Test
      </Link>
      <Link href="/dev-tools/playground" style={styles.link}>
        Playground
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  link: {
    fontSize: 18,
    color: '#007AFF',
    paddingVertical: 12,
  },
});
