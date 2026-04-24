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
3. [ ] Create theme constants (colors, spacing, typography)
4. [ ] Create base component patterns (variants, sizes, states)

### Phase 2: Components (Priority Order)
1. [ ] **Button** - Primary interaction (component + demo)
2. [ ] **Text** - Typography base
3. [ ] **Sidebar** - Collapsible nav drawer (mobile: drawer, desktop: collapsible sidebar)
4. [ ] **TextInput** - Form input
4. [ ] **Card** - Container
5. [ ] **Avatar** - Image representation
6. [ ] **Badge** - Status indicator
7. [ ] **Chip** - Selection tags
8. [ ] **Divider** - Separator
9. [ ] **ListItem** - List rows
10. [ ] **Icon** - Icon wrapper
11. [ ] **Image** - Image display
12. [ ] **Checkbox** - Binary selection
13. [ ] **Switch** - Toggle
14. [ ] **Slider** - Range
15. [ ] **RadioButton** - Single selection
16. [ ] **FAB** - Floating action
17. [ ] **Modal** - Dialog
18. [ ] **BottomSheet** - Bottom modal
19. [ ] **Toast** - Notifications
20. [ ] **Skeleton** - Loading states

### Phase 3: Polish
- [ ] Consistent prop patterns across all components
- [ ] Consistent styling/spacing
- [ ] Update `index.tsx` exports
- [ ] Update playground demos

## Playground Structure

The playground (`playground.tsx`) will feature:
- **Sidebar** (left): Scrollable list of all component names
  - **Mobile**: Full-screen drawer overlay, closes on selection
  - **Desktop**: Collapsible sidebar (240px width), can be toggled open/closed
- **Demo Area** (right): Renders the selected component's demo
- **Header**: Contains hamburger menu (mobile) / toggle button (desktop)
- **Responsive**: Sidebar behavior adapts based on screen size

## Next Steps

1. Start with Phase 1 - Foundation
2. Build Button component first (as reference pattern)
3. Progress through components in order
4. Test each component in playground
5. Update PLAN.md as we go
