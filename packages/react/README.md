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

## Components

### `Button`

Accessible push button supporting variants (`primary`, `secondary`, `subtle`, `ghost`, `danger`) and dense control heights (`xs: 24px`, `sm: 28px`, `md: 32px`, `lg: 36px`, `xl: 40px`).

```jsx
import { Button } from '@pact-design/react'

function Example() {
  return (
    <Button variant="primary" size="md" onPress={() => console.log('Clicked')}>
      Save Changes
    </Button>
  )
}
```

### `Checkbox`

Compact checkbox primitive with support for indeterminate states, label, description, and keyboard focus rings.

```jsx
import { Checkbox } from '@pact-design/react'

function Example() {
  return (
    <Checkbox
      label="Enable compact layout"
      description="Optimizes control height and padding for high information density."
      defaultSelected
    />
  )
}
```

### `Menu`

Keyboard-navigable dropdown menu supporting groups, section headers, shortcuts, and destructive items.

```jsx
import { Menu } from '@pact-design/react'

const items = [
  {
    type: 'group',
    label: 'Actions',
    items: [
      { label: 'Edit', shortcut: '⌘E', onClick: () => console.log('Edit') },
      { label: 'Duplicate', shortcut: '⌘D', onClick: () => console.log('Duplicate') }
    ]
  },
  { type: 'separator' },
  { label: 'Delete', tone: 'danger', shortcut: '⌘⌫', onClick: () => console.log('Delete') }
]

function Example() {
  return <Menu triggerLabel="Options" items={items} />
}
```

---

## Design Principles

- **Compact Density**: Sized for data-intensive tools, dashboards, and enterprise workspaces.
- **Accessibility by Default**: Built on React Aria primitives with complete ARIA attributes and focus management.
- **Token Driven**: 100% styled using Pact Design system tokens (colors, control heights, radii, elevation, focus offsets).
