import type {
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/native';
import {
  type StackNavigationEventMap,
  type StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';
import { withLayoutContext } from 'expo-router';

/**
 *
 * This is the only component that you have to care about
 * */
function Routes() {
  return (
    <>
      <JsStack.Screen name="index" options={{ title: 'Slate' }} />
      <JsStack.Screen name="dev-tools" options={{ title: 'Dev Tools' }} />
      <JsStack.Screen
        name="dev-tools/flux-test"
        options={{ title: 'Flux Test' }}
      />
      <JsStack.Screen
        name="dev-tools/playground"
        options={{ title: 'Playground' }}
      />
    </>
  );
}

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);

import { Colors, ThemeProvider, useThemeColor } from '@ui/theme';

function RootStack() {
  const backgroundColor = useThemeColor({
    light: Colors.light.background,
    dark: Colors.dark.background,
  });
  const foregroundColor = useThemeColor({
    light: Colors.light.foreground,
    dark: Colors.dark.foreground,
  });
  const borderColor = useThemeColor({
    light: Colors.light.border,
    dark: Colors.dark.border,
  });

  return (
    <JsStack
      screenOptions={{
        headerStyle: {
          backgroundColor,
          borderBottomColor: borderColor,
          borderBottomWidth: 1,
        },
        headerTintColor: foregroundColor,
        headerShadowVisible: false,
        cardStyle: {
          backgroundColor,
        },
      }}
    >
      <Routes />
    </JsStack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}
