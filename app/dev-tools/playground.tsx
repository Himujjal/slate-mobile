import { Playground } from '@ui/playground';
import { ThemeToggleButton } from '@ui/theme';
import { Stack } from 'expo-router';

export default function PlaygroundRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => <ThemeToggleButton />,
        }}
      />
      <Playground />
    </>
  );
}
