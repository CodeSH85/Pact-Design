# @pact-design/react

**Dense, compact, and accessible React UI components built upon React Aria and Pact Design tokens.**

---

## Overview

`@pact-design/react` provides foundational, high-density React components styled with [Pact Design](https://github.com/choush/Pact-Design) design tokens. All interactive components are backed by [React Aria Components](https://react-spectrum.adobe.com/react-aria/index.html) to guarantee enterprise-grade accessibility (WAI-ARIA compliance, full keyboard navigation, and screen reader ergonomics) paired with domain-neutral, compact visual styling.

---

## Installation

```bash
pnpm add @pact-design/react @pact-design/styles react-aria-components
```

Import the compiled Pact Design stylesheet once in your application entrypoint:

```typescript
// main.tsx
import '@pact-design/react/styles.css'
// or: import '@pact-design/styles/css'
```

All 29 components are styled entirely with pre-compiled static CSS and require **no** UnoCSS or Tailwind CSS setup.

---

## Architecture & Exports

Code is organized by component under `src/components/` and shared prop utilities under `src/utils/` (`props.ts`). Each component lives in its own directory with a barrel `index.ts`, exposed through the root package entrypoint:

```typescript
// Import all components from root
import {
  Autocomplete,
  Breadcrumbs,
  Button,
  Calendar,
  ComboBox,
  DateField,
  DatePicker,
  Dialog,
  Disclosure,
  DisclosureGroup,
  FileTrigger,
  Form,
  ListBox,
  Menu,
  Modal,
  Popover,
  Radio,
  RadioGroup,
  SearchField,
  Select,
  Separator,
  Sheet,
  Switch,
  Tab,
  Tabs,
  TextField,
  Toast,
  ToastRegion,
  ToggleButton,
  Tree,
  toast
} from '@pact-design/react'

// Or import specific component subpaths
import { Button } from '@pact-design/react/Button'
import { Select } from '@pact-design/react/Select'
import { Modal } from '@pact-design/react/Modal'
```

---

## Components

### Actions & Selection
- **`Button`**: Push button supporting `variant` (`primary`, `secondary`, `subtle`, `ghost`, `danger`) and control heights (`xs`–`xl`).
- **`ToggleButton` & `ToggleButtonGroup`**: Two-state button with active surface indicators and segmented groups.
- **`Checkbox` & `CheckboxGroup`**: Compact checkbox with `@remixicon/react` check and indeterminate icons, label/description support.
- **`Radio` & `RadioGroup`**: Mutually exclusive radio selection group with vertical and horizontal orientations, labels, and descriptions.
- **`Switch`**: Smooth pill toggle switch with compact `sm` and `md` tracks.

### Navigation & Layout
- **`Breadcrumbs`**: Hierarchical breadcrumb navigation trail with automatic separator chevron and active link styling.
- **`Separator`**: Accessible horizontal or vertical divider with `subtle`, `default`, and `strong` border tones.
- **`Tab` & `Tabs`**: Multi-panel tab navigation supporting `underline`, `segmented`, and `pill` variants in horizontal and vertical orientations.
- **`Disclosure` & `DisclosureGroup`**: Expandable accordion panels with rotating chevron indicator and grouped border-divider modes.
- **`Tree`**: Hierarchical tree grid with expandable branch chevrons, nested indentation, and keyboard/selection support.

### Overlays & Menus
- **`Dialog`**: Standalone dialog primitive (`Dialog`, `DialogTrigger`, `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogCloseButton`) shared across overlay containers.
- **`Menu`**: Accessible dropdown menu with declarative `items` prop or composable compound subcomponents (`MenuItem`, `MenuSection`, `MenuSeparator`).
- **`Popover`**: Floating content container with elevation shadow, optional arrow, and smooth placement animations.
- **`Modal`**: Dialog overlay with scrim backdrop, header close button, and responsive sizes (`sm`–`full`).
- **`Sheet`**: Swipeable edge drawer/sheet overlay (`left`, `right`, `top`, `bottom`, `center`) with backdrop, header, scrollable body, and footer.
- **`Toast` & `ToastRegion`**: Floating notifications powered by `UNSTABLE_Toast` and `UNSTABLE_ToastQueue` with `info`, `success`, `warning`, and `danger` tones.

### Data Entry & Inputs
- **`TextField`**: Single-line text input with prefix/suffix slots, label, description, and error message.
- **`SearchField`**: Standalone search input with search icon and clear button.
- **`ListBox`**: Standalone selectable list primitive (`ListBox`, `ListBoxItem`, `ListBoxSection`, `ListBoxHeader`, `ListBoxSeparator`) with `plain` and `bordered` surfaces.
- **`Select`**: Collapsible select picker with check indicators and trigger button variants.
- **`ComboBox`**: Autocomplete select dropdown with filterable listbox, keyboard navigation, and check indicators.
- **`Autocomplete`**: Searchable collection input powered by React Aria `useFilter` and `SearchField`.
- **`DateField`**: Segmented date input with tabular numerals (`tabular-nums font-mono`) powered by `@internationalized/date`.
- **`Calendar`**: Standalone interactive calendar grid (`Calendar`, `CalendarGrid`, `CalendarCell`, `CalendarHeading`).
- **`DatePicker`**: Combines `DateField` with an interactive `Calendar` popover for date selection.
- **`FileTrigger`**: Native file upload activator wrapping any pressable button or trigger element.
- **`Form`**: Form container with semantic `FormSection` and `FormActions` helpers.
- **`Field` Primitives**: Shared form primitives (`Label`, `FieldDescription`, `FieldError`, `FieldGroup`, `Input`, `FieldButton`).

---

## Design Principles

- **Compact Density**: Sized for data-intensive tools, dashboards, and enterprise workspaces (`24px`–`40px` control heights).
- **Accessibility by Default**: Built on React Aria primitives with complete ARIA attributes and focus management.
- **Token Driven**: 100% styled using Pact Design system tokens (colors, control heights, radii, elevation, focus offsets).
- **Zero Utility-CSS Lock-in**: Styled with pre-compiled semantic `.pd-*` CSS from `@pact-design/styles` using `:where()` modifiers and `data-*` attributes—works with plain CSS, CSS Modules, Tailwind, or UnoCSS.
