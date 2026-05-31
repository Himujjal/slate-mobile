import { mock } from 'bun:test';

(globalThis as any).__DEV__ = true;
process.env.EXPO_OS = 'web';
(globalThis as any).expo = {
  ...(globalThis.expo || {}),
  EventEmitter: class {},
  modules: {},
};

mock.module('react-native', () => ({
  View: 'div',
  Text: 'span',
  TextInput: 'input',
  Button: 'button',
  Switch: 'input',
  ScrollView: 'div',
  FlatList: 'div',
  SectionList: 'div',
  VirtualizedList: 'div',
  Pressable: 'button',
  TouchableOpacity: 'button',
  TouchableHighlight: 'button',
  TouchableWithoutFeedback: 'button',
  Image: 'img',
  ImageBackground: 'div',
  ActivityIndicator: 'div',
  Modal: 'div',
  RefreshControl: 'div',
  SafeAreaView: 'div',
  StatusBar: 'div',
  KeyboardAvoidingView: 'div',
  Animated: {
    View: 'div',
    Text: 'span',
    Image: 'img',
    ScrollView: 'div',
    FlatList: 'div',
    createAnimatedComponent: (c: unknown) => c,
  },
  StyleSheet: {
    create: (s: Record<string, unknown>) => s,
    hairlineWidth: 1,
    absoluteFill: {},
    absoluteFillObject: {},
    flatten: (s: unknown) => s,
  },
  Platform: {
    OS: 'web',
    select: (o: Record<string, unknown>) => o.web ?? o.default,
    Version: '0',
  },
  Alert: { alert: () => {} },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
    addEventListener: () => ({ remove: () => {} }),
  },
  Keyboard: {
    addListener: () => ({ remove: () => {} }),
    dismiss: () => {},
    removeListener: () => {},
  },
  useColorScheme: () => 'light',
  useWindowDimensions: () => ({ width: 375, height: 812 }),
  TurboModuleRegistry: { getEnforcing: () => ({}), get: () => null },
  NativeEventEmitter: class {},
  NativeModules: {},
  DeviceEventEmitter: { addListener: () => ({ remove: () => {} }) },
  processColor: (c: unknown) => c,
  AppRegistry: { registerComponent: () => {}, runApplication: () => {} },
  AppState: {
    addEventListener: () => ({ remove: () => {} }),
    currentState: 'active',
  },
  BackHandler: {
    addEventListener: () => ({ remove: () => {} }),
    exitApp: () => {},
  },
  InteractionManager: { runAfterInteractions: (fn: () => void) => fn() },
  LayoutAnimation: { configureNext: () => {} },
  Linking: {
    openURL: () => Promise.resolve(),
    canOpenURL: () => Promise.resolve(true),
  },
  PanResponder: { create: () => ({}) },
  PermissionsAndroid: { request: () => Promise.resolve(true) },
  PixelRatio: { get: () => 1, getFontScale: () => 1 },
  ToastAndroid: { show: () => {} },
  UIManager: {},
  Vibration: { vibrate: () => {} },
  findNodeHandle: () => null,
  unstable_batchedUpdates: (fn: () => void) => fn(),
}));

mock.module('react-native-reanimated', () => ({
  default: {
    createAnimatedComponent: (c: unknown) => c,
    View: 'div',
    Text: 'span',
    ScrollView: 'div',
    Image: 'img',
    FlatList: 'div',
  },
  useSharedValue: (v: unknown) => ({ value: v }),
  useAnimatedStyle: () => ({}),
  withSpring: (v: unknown) => v,
  withTiming: (v: unknown) => v,
  withRepeat: (v: unknown) => v,
  withSequence: (...args: unknown[]) => args,
  withDelay: (_d: number, v: unknown) => v,
  runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
  runOnUI: (fn: (...args: unknown[]) => unknown) => fn,
  Easing: { linear: 0, ease: 1, elastic: 2 },
  SlideInLeft: {},
  SlideInRight: {},
  SlideOutLeft: {},
  SlideOutRight: {},
}));

mock.module('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'div',
  GestureDetector: 'div',
  Gesture: {
    Pan: () => ({}),
    Tap: () => ({}),
    LongPress: () => ({}),
    Pinch: () => ({}),
    Rotation: () => ({}),
  },
  Directions: { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 },
  State: { UNDETERMINED: 0, BEGAN: 1, ACTIVE: 2, END: 3 },
}));

mock.module('react-native-screens', () => ({
  Screen: 'div',
  ScreenContainer: 'div',
  NativeScreenContainer: 'div',
  NativeScreen: 'div',
}));

mock.module('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: unknown }) => children,
  SafeAreaView: 'div',
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaInsetsContext: {
    Provider: ({ children }: { children: unknown }) => children,
  },
}));

mock.module('expo-modules-core', () => ({
  EventEmitter: class {},
  requireNativeModule: () => ({}),
  requireOptionalNativeModule: () => null,
  NativeModulesProxy: {},
  NativeViewGestureHandler: {},
}));

mock.module('expo-system-ui', () => ({
  setBackgroundColorAsync: () => Promise.resolve(),
}));
