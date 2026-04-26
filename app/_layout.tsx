import type {
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/native';
import {
  type StackNavigationEventMap,
  type StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';
import { ToastProvider } from '@ui/index';
import { Colors, ThemeProvider, useThemeColor } from '@ui/theme';
import { withLayoutContext } from 'expo-router';
import { View } from 'react-native';

/**
 * This is the only component that you have to care about
 * */
function Routes() {
  return (
    <View style={{ height: '100%', width: '100%' }} id="outermost">
      <JsStack.Screen name="index" options={{ title: 'Slate' }} />
      <JsStack.Screen name="login" options={{ title: 'Sign In' }} />
      <JsStack.Screen name="dev-tools" options={{ title: 'Dev Tools' }} />
      <JsStack.Screen
        name="dev-tools/flux-test"
        options={{ title: 'Flux Test' }}
      />
      <JsStack.Screen
        name="dev-tools/playground"
        options={{ title: 'Playground' }}
      />
    </View>
  );
}

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);

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
          height: '100%',
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
      <ToastProvider>
        <RootStack />
      </ToastProvider>
    </ThemeProvider>
  );
}
