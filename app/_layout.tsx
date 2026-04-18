import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Slate' }} />
      <Stack.Screen name="dev-tools" options={{ title: 'Dev Tools' }} />
      <Stack.Screen
        name="dev-tools/flux-test"
        options={{ title: 'Flux Test' }}
      />
      <Stack.Screen name="flux-test" options={{ title: 'Flux Test' }} />
    </Stack>
  );
}
