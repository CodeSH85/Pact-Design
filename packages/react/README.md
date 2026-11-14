# @pact-design/react

**Dense, compact, and accessible React UI components built upon React Aria and Pact Design tokens.**

---

## Overview

`@pact-design/react` provides foundational, high-density React components styled with [Pact Design](https://github.com/choush/Pact-Design) design tokens. All interactive components are backed by [React Aria Components](https://react-spectrum.adobe.com/react-aria/index.html) to guarantee enterprise-grade accessibility (WAI-ARIA compliance, full keyboard navigation, and screen reader ergonomics) paired with domain-neutral, compact visual styling.

---

## Installation

```bash
pnpm add @pact-design/react @pact-design/tokens react-aria-components
```

Ensure Pact Design tokens CSS variables or UnoCSS preset is loaded in your application:

```javascript
// main.jsx
import '@pact-design/tokens/css'
```

---

## Architecture & Exports

Code is organized by task under `src/components/` and `src/utils/`. Each component lives in its own directory with a barrel `index.ts`, exposed through the root package entrypoint:

```typescript
// Import all components and utilities from root
import {
  Autocomplete,
  Breadcrumbs,
  Button,
  ComboBox,
  DateField,
  Disclosure,
  DisclosureGroup,
  FileTrigger,
  Form,
  Menu,
  Modal,
  Popover,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Toast,
  ToastRegion,
  ToggleButton,
  toast,
  cn
} from '@pact-design/react'

// Or import specific component subpaths
import { Button } from '@pact-design/react/Button'
import { Select } from '@pact-design/react/Select'
import { Modal } from '@pact-design/react/Modal'
import { cn } from '@pact-design/react/utils'
```

---

## Components

### Actions & Selection
- **`Button`**: Push button supporting `variant` (`primary`, `secondary`, `subtle`, `ghost`, `danger`) and control heights (`xs`–`xl`).
- **`ToggleButton` & `ToggleButtonGroup`**: Two-state button with active surface indicators and segmented groups.
- **`Checkbox` & `CheckboxGroup`**: Compact checkbox with `@remixicon/react` check and indeterminate icons, label/description support.
- **`Switch`**: Smooth pill toggle switch with compact `sm` and `md` tracks.

### Navigation & Layout
- **`Breadcrumbs`**: Hierarchical breadcrumb navigation trail with automatic separator chevron and active link styling.
- **`Tab` & `Tabs`**: Multi-panel tab navigation supporting `underline`, `segmented`, and `pill` variants in horizontal and vertical orientations.
- **`Disclosure` & `DisclosureGroup`**: Expandable accordion panels with rotating chevron indicator and grouped border-divider modes.

### Overlays & Menus
- **`Menu`**: Accessible dropdown menu with declarative `items` prop or composable compound subcomponents (`MenuItem`, `MenuSection`, `MenuSeparator`).
- **`Popover`**: Floating content container with elevation shadow, optional arrow, and smooth placement animations.
- **`Modal`**: Dialog overlay with scrim backdrop, header close button, and responsive sizes (`sm`–`full`).
- **`Toast` & `ToastRegion`**: Floating notifications powered by `UNSTABLE_Toast` and `UNSTABLE_ToastQueue` with `info`, `success`, `warning`, and `danger` tones.

### Data Entry & Inputs
- **`TextField`**: Single-line text input with prefix/suffix slots, label, description, and error message.
- **`Select`**: Collapsible select picker with check indicators and trigger button variants.
- **`ComboBox`**: Autocomplete select dropdown with filterable listbox, keyboard navigation, and check indicators.
- **`Autocomplete`**: Searchable collection input powered by React Aria `useFilter` and `SearchField`.
- **`DateField`**: Segmented date input with tabular numerals (`tabular-nums font-mono`) powered by `@internationalized/date`.
- **`FileTrigger`**: Native file upload activator wrapping any pressable button or trigger element.
- **`Form`**: Form container with semantic `FormSection` and `FormActions` helpers.
- **`Field` Primitives**: Shared form primitives (`Label`, `FieldDescription`, `FieldError`, `FieldGroup`).

---

## Design Principles

- **Compact Density**: Sized for data-intensive tools, dashboards, and enterprise workspaces (`24px`–`40px` control heights).
- **Accessibility by Default**: Built on React Aria primitives with complete ARIA attributes and focus management.
- **Token Driven**: 100% styled using Pact Design system tokens (colors, control heights, radii, elevation, focus offsets).
- **Type-Safe Variants**: Built with `class-variance-authority` (CVA) and custom `tailwind-merge` dynamically synced to `pactTheme`.
