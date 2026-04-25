# Plan for Fixing Playground Demo Rendering

## Problem Analysis

The right-side container showcasing component demos was not appearing in `/app/dev-tools/playground/` route.

### Root Cause
The playground used a dynamic route file `[component].tsx` which doesn't work with the custom `JsStack` navigator (created via `createStackNavigator` from `@react-navigation/stack` + `withLayoutContext` from expo-router). Dynamic route files like `[component].tsx` only work with the standard `<Stack>` navigator from expo-router, not with custom navigators.

Additionally, `[component].tsx` expects a path segment (e.g., `/dev-tools/playground/button`) but the sidebar links used query parameters (e.g., `/dev-tools/playground?component=button`), creating a mismatch.

### Solution
Per the Expo Router documentation on [URL parameters](https://docs.expo.dev/router/reference/url-parameters/), for a single-page playground that swaps content without navigation stack changes, the correct approach is:

1. **Delete `[component].tsx`** — dynamic route files don't work with the custom stack navigator
2. **Render demos directly in `_layout.tsx`** — import all demo components and render them based on query params
3. **Use query parameters** (`?component=button`) — accessed via `useLocalSearchParams` in the layout
4. **Use `<Link>` with query params** in the sidebar for navigation

## Fix Steps (Completed)

- [x] 1. **`index.tsx`** — Redirect to query param URL:
   ```tsx
   return <Redirect href="/dev-tools/playground?component=button" />;
   ```

- [x] 2. **Delete `[component].tsx`** — Removed dynamic route file that doesn't work with JsStack navigator

- [x] 3. **`app/_layout.tsx`** — Reverted: removed the invalid `dev-tools/playground/[component]` screen definition

- [x] 4. **`_layout.tsx`** — Rewrote to:
   - Import all 20 demo components directly
   - Create DEMO_MAP to map component keys to demo functions
   - Read `component` from `useLocalSearchParams()` (query param)
   - Render the matching demo directly in the demo area (replacing `{children}`)
   - Sidebar `<Link>` hrefs use query param format

## Files Modified

1. `app/dev-tools/playground/index.tsx` — Query param redirect
2. `app/dev-tools/playground/_layout.tsx` — Self-contained: imports demos, reads query params, renders demo
3. `app/dev-tools/playground/[component].tsx` — **DELETED**
4. `app/_layout.tsx` — Restored clean route definitions

## Verification

After fix:
- Navigate to `/dev-tools/playground` → redirects to `/dev-tools/playground?component=button` → shows Button demo
- Click "Text" in sidebar → navigates to `/dev-tools/playground?component=text` → shows Text demo
- Click "Card" in sidebar → navigates to `/dev-tools/playground?component=card` → shows Card demo
- The demo should appear on the right side container