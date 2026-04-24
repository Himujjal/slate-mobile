# Plan for UI Library

## Overview

Building a universal UI component library for Expo (iOS, Android, Web) without Flux/accessibility dependencies. Components are pure UI primitives using only Expo/RN core modules.

## 20 Core UI Components

| # | Component | Purpose |
|---|-----------|---------|
| 1 | **Button** | Primary interaction element |
| 2 | **TextInput** | User text entry |
| 3 | **Card** | Content container |
| 4 | **Avatar** | User/profile image representation |
| 5 | **Badge** | Status indicator or count |
| 6 | **Chip** | Tag/filter selection |
| 7 | **Checkbox** | Binary selection |
| 8 | **Switch** | Toggle binary setting |
| 9 | **Slider** | Range value selection |
| 10 | **RadioButton** | Single selection from group |
| 11 | **Text** | Typography component |
| 12 | **Icon** | Visual indicator wrapper |
| 13 | **Image** | Image display (expo-image) |
| 14 | **Divider** | Content separator |
| 15 | **ListItem** | List row element |
| 16 | **FAB** | Floating Action Button |
| 17 | **Modal** | Overlay dialog |
| 18 | **BottomSheet** | Modal sheet sliding from bottom |
| 19 | **Toast/Snackbar** | Transient notification |
| 20 | **Skeleton** | Loading placeholder |
| 21 | **Sidebar** | Collapsible nav drawer |

## File Structure

```
ui/
├── index.tsx              # Exports all components
├── theme.tsx              # Theme configuration
├── playground.tsx         # Interactive playground with sidebar
├── README.md
│
├── <component>/
│   ├── <component>.tsx    # Main component
│   └── <component>-demo.tsx # Demo/showcase component
│
├── button/
│   ├── button.tsx
│   └── button-demo.tsx
├── text-input/
│   ├── text-input.tsx
│   └── text-input-demo.tsx
├── card/
│   ├── card.tsx
│   └── card-demo.tsx
... (and so on for all 20 components)
```

## Responsive Strategy

Using React Native flexible layouts with Platform checks (mobile-first):

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| - | - | Mobile (portrait) |
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops/desktops |

**Key patterns:**
- **Mobile**: Single column, full-width, 44px touch targets
- **Desktop**: Constrained max-width (~1024px), centered
- **Modals**: Bottom sheet on mobile, centered dialog on desktop
- **Layout**: Use flexbox, avoid fixed pixels
- **Styling**: Use StyleSheet.create() with React Native styles
- **Platform**: Use Platform.select() for platform-specific code

## Implementation Steps

### Phase 1: Foundation
1. [x] Create sidebar.tsx component with relevant component for the same.
2. [x] Update `playground.tsx` with sidebar + demo viewer layout
3. [x] Create theme constants (colors, spacing, typography)
4. [x] Create base component patterns (variants, sizes, states)

### Phase 2: Components (Priority Order)
1. [x] **Button** - Primary interaction (component + demo)
2. [x] **Text** - Typography base
3. [x] **Sidebar** - Collapsible nav drawer (mobile: drawer, desktop: collapsible sidebar)
4. [x] **TextInput** - Form input
4. [x] **Card** - Container
5. [x] **Avatar** - Image representation
6. [x] **Badge** - Status indicator
7. [x] **Chip** - Selection tags
8. [x] **Divider** - Separator
9. [x] **ListItem** - List rows
10. [x] **Icon** - Icon wrapper
11. [x] **Image** - Image display
12. [x] **Checkbox** - Binary selection
13. [x] **Switch** - Toggle
14. [x] **Slider** - Range
15. [x] **RadioButton** - Single selection
16. [x] **FAB** - Floating action
17. [x] **Modal** - Dialog
18. [x] **BottomSheet** - Bottom modal
19. [x] **Toast** - Notifications
20. [x] **Skeleton** - Loading states

### Phase 3: Polish
- [x] Consistent prop patterns across all components
- [x] Consistent styling/spacing
- [x] Update `index.tsx` exports
- [x] Update playground demos

## Playground Structure

The playground (`playground.tsx`) will feature:
- **Sidebar** (left): Scrollable list of all component names
  - **Mobile**: Full-screen drawer overlay, closes on selection
  - **Desktop**: Collapsible sidebar (240px width), can be toggled open/closed
- **Demo Area** (right): Renders the selected component's demo
- **Header**: Contains hamburger menu (mobile) / toggle button (desktop)
- **Responsive**: Sidebar behavior adapts based on screen size

## Next Steps

1. [x] Completed Phase 1 - Foundation
2. [x] Completed Phase 2 - Components (all 20 built)
3. [x] Completed Phase 3 - Polish (update playground demos)
4. [ ] Test all components in playground
5. Update PLAN.md as we go
