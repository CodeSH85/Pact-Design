# Pact Design — Token Specification

All token files strictly follow the **W3C Design Tokens Community Group (DTCG) Format Module 2025.10** specification (`$value`, `$type`). See <https://www.designtokens.org/tr/2025.10/format/> for full specification details.

---

## 1. Architecture & Principles

### 1.1 Three-Tier Token Hierarchy

Pact Design organizes design tokens into three distinct tiers to separate raw primitives from semantic intent and component-specific overrides:

1. **Global (`global.*`)**: Foundation primitives with no semantic meaning.
2. **System (`system.*`)**: Semantic tokens representing themeable UI roles, hierarchy, and density.
3. **Component (`component.*`)**: Scoped tokens bound to specific UI components (e.g., Data Grid, Tree View, Button, Modal).

#### Global Level (`tokens/*/global.json`)

- Serves as the single source of truth for raw values (OKLCH colors, `rem`/`px` dimensions, font weights, stroke styles).
- Uses numeric scales (`00`, `01`, `02`... or `50`–`1000` for 11-step color palettes) rather than semantic names.

> [!IMPORTANT]
> Never reference `global.*` tokens directly in application or component stylesheets. Always consume `system.*` (or `component.*`) tokens so themes and density adjustments propagate automatically.

#### System Level (`tokens/*/system*.json`)

- Maps `global.*` primitives to semantic roles (`background`, `text`, `border`, `semantic`, `font`, `spacing`, `size`, `radius`, `stroke`, `elevation`).
- Uses a unified **T-shirt sizing scale** (`xs`, `sm`, `md`, `lg`, `xl`, with `3xs`–`5xl` extensions for spacing/sizing) anchored around `md` (`1rem` / `16px`).

#### Component Level (Planned)

- Maps `system.*` tokens to specific component slots when independent customization is required without breaking system-wide semantics.

### 1.2 Structural Conventions

- **Nested Hierarchy over Hyphenated Keys**: Token groups use nested JSON objects (e.g., `global.font.weight.regular`, `global.shadow.color.01`, `system.background.layer-1`) rather than flat hyphenated keys.
- **Property Ordering**: Within token leaf nodes, `$value` is placed before `$type`.

---

## 2. Theming Strategy (Light & Dark Modes)

Pact Design implements theming at the **System (`system.*`)** layer using **split token sets** (`system.light.json` and `system.dark.json`):

- **100% Identical Token Paths**: Light and Dark files define the exact same JSON hierarchy and token names. Theme names (`light` / `dark`) are never embedded in token paths.
- **File Structure**:
  - `tokens/color/global.json` — Shared perceptual OKLCH palettes.
  - `tokens/color/system.light.json` — Light mode semantic mappings (`:root, [data-theme="light"]`).
  - `tokens/color/system.dark.json` — Dark mode semantic mappings (`[data-theme="dark"]`).

---

## 3. Token Categories

### 3.1 Color (`tokens/color/`)

#### Global Palettes (`tokens/color/global.json`)

- **Color Space**: Perceptually uniform **OKLCH** (`colorSpace: "oklch"`, `components: [L, C, H]`, `alpha`, plus sRGB `hex` fallback).
- **13 Scales × 11 Shades (`50`–`1000`)**: `gray`, `coolGray`, `warmGray`, `cyan`, `blue`, `indigo`, `purple`, `magenta`, `red`, `orange`, `yellow`, `green` (clean emerald hue at `H = 148°`), and `mint`, plus `white` (`#ffffff`) and `black` (`#000000`).
- **11-Step Perceptual Lightness Curve (`50` to `1000`)**:
  - `50` (`L = 0.968`) → `100` (`0.930`) → `200` (`0.870`) → `300` (`0.790`) → `400` (`0.698`) → `500` (`0.600`, true perceptual midpoint) → `600` (`0.504`) → `700` (`0.414`) → `800` (`0.338`) → `900` (`0.276`) → `1000` (`0.228`).
- **APCA & sRGB Gamut Baseline**:
  - All `500`–`1000` shades pass **APCA `|Lc| >= 60`** against `#ffffff` (`500` reaches `Lc +63.9` to `+69.4` as text on white and `Lc -69.4` to `-74.8` with white text on solid backgrounds; `600` reaches `Lc +77.1` to `+81.5` and WCAG `≥ 5.5:1`).
  - All 143 shades lie 100% within the standard sRGB gamut.

#### System Background Layers & Interactive Surface States (`system.background.*`)

Workspace surfaces are divided into four luminance layers, a translucent modal/drawer backdrop, and four interactive surface states for data grids, tree views, and selectable lists:

| Token | Light Value | Dark Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| `system.background.base` | `{global.gray.100}` (`#e8e8e8`) | `{global.gray.1000}` (`#1c1c1c`) | Lowest application canvas / pasteboard; no interactive elements are placed directly on this layer. |
| `system.background.layer-1` | `{global.gray.50}` (`#f4f4f4`) | `{global.gray.900}` (`#282828`) | Primary structural chrome (`TopNav`, `Side-Nav`, docking toolbars, inspector panels). |
| `system.background.layer-2` | `{global.white}` (`#ffffff`) | `{global.gray.800}` (`#373737`) | Main editing workspace, artboards, data tables, and primary content containers. |
| `system.background.elevated` | `{system.background.layer-2}` (`#ffffff`) | `{system.background.layer-2}` (`#373737`) | Floating elements over the workspace (contextual popovers, modals, dropdowns), paired with `system.elevation.*`. |
| `system.background.backdrop` | `{global.scrim.01}` (`#000000 · α 0.48`) | `{global.scrim.02}` (`#000000 · α 0.68`) | Translucent scrim / backdrop behind modals (`z-index.modal`) and drawers (`z-index.drawer`). |
| `system.background.hover` | `{global.gray.50}` (`#f4f4f4`) | `{global.gray.700}` (`#4b4b4b`) | Neutral hover state for table rows, tree nodes, and quiet buttons (`|Lc| > 94` with `text.primary`). |
| `system.background.active` | `{global.gray.100}` (`#e8e8e8`) | `{global.gray.600}` (`#646464`) | Neutral pressed / active state for interactive surfaces (`|Lc| > 84` with `text.primary`). |
| `system.background.selected` | `{global.indigo.50}` (`#f2f3ff`) | `{global.indigo.900}` (`#1f2547`) | Selected tree node or data grid row (`|Lc| > 97` with `text.primary`). |
| `system.background.selected-hover` | `{global.indigo.100}` (`#e3e6ff`) | `{global.indigo.800}` (`#293260`) | Hover state on an already-selected tree node or table row (`|Lc| > 90` with `text.primary`). |

#### System Text Hierarchy (`system.text.*`)

Engineered to pass **APCA** (`Lc`) and WCAG 2.1 contrast across **all background and interactive layers**:

| Token | Light Value | Light APCA (`Lc` on `layer-2`) | Dark Value | Dark APCA (`Lc` on `layer-2`) | Semantic Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `system.text.primary` | `{global.gray.1000}` (`#1c1c1c`) | `Lc +104.0` | `{global.white}` (`#ffffff`) | `Lc -100.9` | Headings, body copy, primary table cells, identifiers (`Lc 90+`). |
| `system.text.secondary` | `{global.gray.700}` (`#4b4b4b`) | `Lc +89.8` | `{global.gray.50}` (`#f4f4f4`) | `Lc -93.6` | Subheaders, form labels, secondary metadata (`Lc 75+`). |
| `system.text.muted` | `{global.gray.600}` (`#646464`) | `Lc +79.6` | `{global.gray.200}` (`#d4d4d4`) | `Lc -73.5` | Captions, helper text, timestamps (`Lc 70+`). |
| `system.text.disabled` | `{global.gray.400}` (`#9e9e9e`) | `Lc +52.1` | `{global.gray.500}` (`#808080`) | `Lc -27.8` | Disabled labels and inactive controls. |

#### System Border Colors (`system.border.*`)

| Token | Light Value | Dark Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| `system.border.subtle` | `{global.gray.100}` (`#e8e8e8`) | `{global.gray.600}` (`#646464`) | Internal panel dividers and dense table row hairlines (`|Lc| ~15.2` on dark `layer-2`). |
| `system.border.default` | `{global.gray.200}` (`#d4d4d4`) | `{global.gray.500}` (`#808080`) | Default container, card, and panel borders (`|Lc| ~27.8` on dark `layer-2`). |
| `system.border.strong` | `{global.gray.400}` (`#9e9e9e`) | `{global.gray.300}` (`#bababa`) | High-contrast form input borders (`|Lc| ~58.2` on dark `layer-2`). |
| `system.border.focus` | `{system.semantic.primary}` | `{global.indigo.300}` | Keyboard focus ring indicator (`|Lc| > 55` across all surfaces). |

#### System Semantic Status & Action Colors (`system.semantic.*`)

Each semantic role (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `neutral`) defines 7 coordinated tokens divided into two patterns:

1. **Solid Action Pattern (`<role>`, `<role>-hover`, `<role>-active`, `on-<role>`)**:
   - Maintains a consistent **light-text on deep-background (`字淺背景深`)** visual hierarchy in both Light and Dark themes (`|Lc| >= 69` in Light, `|Lc| >= 82` in Dark).
2. **Subtle Status Container Pattern (`<role>-subtle`, `on-<role>-subtle`, `<role>-border`)**:
   - Uses **same-hue (`同色系`)** soft backgrounds, high-contrast colored text (`|Lc| >= 75` on `*-subtle` and `|Lc| >= 72` on `layer-2`), and subtle borders for compact status badges, inline banners, and outline controls.

| Role | Hue Family | Light Solid (`default / hover / active / on`) | Dark Solid (`default / hover / active / on`) | Light Subtle (`bg / on / border`) | Dark Subtle (`bg / on / border`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | `indigo` | `500 / 600 / 700 / white` | `600 / 500 / 700 / white` | `100 / 700 / 200` | `900 / 200 / 700` |
| **Secondary** | `blue` | `600 / 700 / 800 / white` | `600 / 500 / 700 / white` | `100 / 700 / 200` | `900 / 200 / 700` |
| **Success** | `green` | `500 / 600 / 700 / white` | `600 / 500 / 700 / white` | `100 / 700 / 200` | `900 / 200 / 700` |
| **Danger** | `red` | `500 / 600 / 700 / white` | `600 / 500 / 700 / white` | `100 / 700 / 200` | `900 / 200 / 700` |
| **Warning** | `orange` | `500 / 600 / 700 / white` | `600 / 500 / 700 / white` | `100 / 700 / 200` | `900 / 200 / 700` |
| **Info** | `blue` | `500 / 600 / 700 / white` | `600 / 500 / 700 / white` | `100 / 700 / 200` | `900 / 200 / 700` |
| **Neutral** | `coolGray` | `600 / 700 / 800 / white` | `600 / 500 / 700 / white` | `100 / 700 / 200` | `900 / 200 / 700` |

---

### 3.2 Typography (`tokens/typography/`)

#### Global Primitives (`tokens/typography/global.json`)

- **Families (`global.font.family.*`)**: `sans` (`["Inter", "Open Sans", "Roboto"]`), `mono` (`["JetBrains Mono", "SFMono-Regular", "Menlo", "Consolas", "monospace"]`).
- **Sizes (`global.font.size.01`–`13`)**: `0.5rem` (8px), `0.625rem` (10px), `0.75rem` (12px), `0.875rem` (14px), `1rem` (16px), `1.125rem` (18px), `1.25rem` (20px), `1.5rem` (24px), `1.75rem` (28px), `2rem` (32px), `2.25rem` (36px), `3rem` (48px), `3.75rem` (60px).
- **Weights (`global.font.weight.*`)**: `01` (300), `02` (400), `03` (500), `04` (600), `05` (700).
- **Line Heights (`global.font.line-height.01`–`09`)**: Unitless ratios from `1.1` to `1.7`.
- **Letter Spacing (`global.font.letter-spacing.01`–`10`)**: `-0.04rem` to `0.05rem` (`05` = `0rem`).

#### System Composite Typography (`tokens/typography/system.json`)

All 27 system typography tokens use `$type: "typography"` (`fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`):

| Category | Scale | Sizes (`px` / `rem`) | Weight | Line Height | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `system.font.display` | `sm`, `md`, `lg` | 36px, 48px, 60px | 700 | `1.1`–`1.15` | `-0.04` to `-0.02rem` | Hero metrics and large promotional callouts. |
| `system.font.heading` | `xs`, `sm`, `md`, `lg`, `xl` | 20px, 24px, 28px, 32px, 36px | 600–700 | `1.15`–`1.3` | `-0.02` to `-0.005rem` | Page, section, and dialog titles. |
| `system.font.subheader` | `sm`, `md`, `lg` | 16px, 18px, 20px | 500 | `1.4` | `-0.01` to `0rem` | Section introductions and panel headers. |
| `system.font.body` | `xs`, `sm`, **`md`**, `lg`, `xl` | 12px, 14px, **16px**, 18px, 20px | 400 | `1.5`–`1.6` | `0` to `0.01rem` | Reading copy and table content (`md` = `1rem`). |
| `system.font.label` | `xs`, `sm`, **`md`**, `lg`, `xl` | 12px, 14px, **16px**, 18px, 20px | 500 | `1.3` | `0` to `0.02rem` | Form labels, buttons, tabs, and navigation items. |
| `system.font.caption` | `sm`, `md`, `lg` | 10px, 12px, 14px | 400 | `1.4` | `0.01` to `0.02rem` | Image captions, footnotes, and helper annotations. |
| `system.font.mono` | `xs`, `sm`, **`md`** | 12px, 14px, **16px** | 400 | `1.4`–`1.5` | `0rem` | Identifiers (`ID-2026-0048`), version strings (`v2.1.0`), hashes, and code snippets. |

#### Tabular Numerals Convention (`.tabular-nums`)

For numeric columns in data tables, metrics (`12.05 ms`), quantities, and percentages that retain the proportional `sans` typeface (`system.font.body.*` / `system.font.label.*`), apply the CSS OpenType numeric modifier rather than switching font families:

```css
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

---

### 3.3 Spacing (`tokens/spacing/`)

- **Global (`global.spacing.00`–`12`)**: `0px` (`00`) and `0.125rem` (2px) up to `4rem` (64px).
- **System (`system.spacing.*`)**: Anchored at `md = 1rem` (16px):
  - `none` (0px), `3xs` (2px), `2xs` (4px), `xs` (8px), `sm` (12px), **`md` (16px)**, `lg` (20px), `xl` (24px), `2xl` (32px), `3xl` (40px), `4xl` (48px), `5xl` (64px).

---

### 3.4 Sizing & Density (`tokens/sizing/`)

- **Global (`global.size.01`–`13`)**: `0.25rem` (4px), `0.5rem` (8px), `0.75rem` (12px), `1rem` (16px), `1.25rem` (20px), `1.5rem` (24px), `1.75rem` (28px), `2rem` (32px), `2.25rem` (36px), `2.5rem` (40px), `3rem` (48px), `4rem` (64px), `5rem` (80px).
- **System Base Sizes (`system.size.*`)**:
  - `3xs` (4px), `2xs` (8px), `xs` (16px), `sm` (20px), **`md` (24px)**, `lg` (32px), `xl` (36px), `2xl` (40px), `3xl` (48px), `4xl` (64px), `5xl` (80px).
- **System Control & Row Height Density (`system.control.height.*`)**:
  - `xs` (`1.5rem` / `24px`) — Ultra-Compact density (inline table actions, dense tree nodes).
  - `sm` (`1.75rem` / `28px`) — Compact density (high-density data grid rows, compact toolbars, default buttons).
  - `md` (`2rem` / `32px`) — Default desktop density (standard inputs, buttons, table rows).
  - `lg` (`2.25rem` / `36px`) — Comfortable density (dialog form fields, primary actions).
  - `xl` (`2.5rem` / `40px`) — Spacious density (top-level command bars, hero CTAs).
- **System Icon Sizing (`system.icon.size.*`)**:
  - `xs` (`0.75rem` / `12px`) — Tree disclosure chevrons, inline status badge icons.
  - `sm` (`1rem` / `16px`) — Compact toolbar and data grid action icons (pairs with `control.height.xs`–`sm`).
  - `md` (`1.25rem` / `20px`) — Standard button and navigation icons (pairs with `control.height.md`–`lg`).
  - `lg` (`1.5rem` / `24px`) — Primary command bar and dialog header icons (pairs with `control.height.xl`).
  - `xl` (`2rem` / `32px`) — Empty states and module callout illustrations.

---

### 3.5 Border & Focus Ring (`tokens/border/`)

Unified under the `border` and `focus` namespaces (`global.border.*`, `system.border.width.*`, `system.focus.*`) to align with `system.border.{subtle, default, strong, focus}` color tokens:

- **Global (`tokens/border/global.json`)**:
  - `global.border.width.00`–`06` (`0px`–`6px`)
  - `global.border.style.{solid, dashed, inset, outset}` (`$type: "strokeStyle"`)
  - `global.border.offset.{inset-02, inset-01, 00, 01, 02}` (`-2px`, `-1px`, `0px`, `1px`, `2px`)
  - `global.radius.00`–`07` (`0px`, `0.125rem` [2px], `0.25rem` [4px], `0.5rem` [8px], `0.75rem` [12px], `1rem` [16px], `1.5rem` [24px], `2rem` [32px]) and `full` (`999rem`)
- **System (`tokens/border/system.json`)**:
  - **Border Width (`system.border.width.*`)**: `none` (0px), `sm` (1px), `md` (2px), `lg` (3px).
  - **Focus Ring Geometry (`system.focus.*`)**:
    - `system.focus.width` (`2px`, `{global.border.width.02}`) and `system.focus.style` (`solid`, `{global.border.style.solid}`).
    - `system.focus.offset.default` (`2px`, `{global.border.offset.02}`) — Outer focus ring for standalone buttons and controls.
    - `system.focus.offset.flush` (`0px`, `{global.border.offset.00}`) — Flush focus ring for text inputs and docked controls.
    - `system.focus.offset.inset` (`-2px`, `{global.border.offset.inset-02}`) — Inset focus ring for `overflow: hidden` data grid cells and tree rows.
  - **Border Radius (`system.radius.*`)**: `none` (0px), `2xs` (2px), `xs` (4px), `sm` (8px), `md` (12px), `lg` (16px), `xl` (24px), `full` (999rem).

---

### 3.6 Elevation & Z-Index (`tokens/elevation/`)

- **Global (`tokens/elevation/global.json`)**:
  - `global.offset.00`–`05` (`0px`, `1px`, `2px`, `4px`, `8px`, `16px`)
  - `global.blur.01`–`06` (`2px`, `4px`, `8px`, `16px`, `24px`, `32px`)
  - `global.spread.00`–`05` (`0px`, `-1px`, `-2px`, `-4px`, `1px`, `2px`)
  - `global.shadow.color.01`–`05` (Light mode alphas): Black (`oklch(0 0 0)`) with alpha `0.06`, `0.08`, `0.10`, `0.14`, `0.18`.
  - `global.shadow.color.06`–`10` (Dark mode alphas): Black (`oklch(0 0 0)`) with alpha `0.28`, `0.36`, `0.45`, `0.56`, `0.68`.
  - `global.z-index.00`–`07` (`$type: "number"`): `0`, `10`, `100`, `200`, `300`, `400`, `500`, `600`.
- **Themed Shadow Colors (`tokens/elevation/system.{light,dark}.json`)**:
  - `system.shadow.color.{xs, sm, md, lg, xl}` maps to `global.shadow.color.01`–`05` in Light mode and `global.shadow.color.06`–`10` in Dark mode so composite shadows automatically deepen on dark surfaces without duplicating offset/blur/spread definitions.
- **System Elevation & Z-Index (`tokens/elevation/system.json`)**:
  - **Composite Shadows (`system.elevation.*`, `$type: "shadow"`)**:
    - `system.elevation.xs` — `0 1px 2px 0` + `{system.shadow.color.xs}` (`α 0.06` Light / `0.28` Dark)
    - `system.elevation.sm` — `0 2px 4px -1px` + `{system.shadow.color.sm}` (`α 0.08` Light / `0.36` Dark)
    - `system.elevation.md` — `0 4px 8px -2px` + `{system.shadow.color.md}` (`α 0.10` Light / `0.45` Dark)
    - `system.elevation.lg` — `0 8px 16px -4px` + `{system.shadow.color.lg}` (`α 0.14` Light / `0.56` Dark)
    - `system.elevation.xl` — `0 16px 32px -4px` + `{system.shadow.color.xl}` (`α 0.18` Light / `0.68` Dark)
  - **Z-Index Stacking Order (`system.z-index.*`, `$type: "number"`)**:
    - `base` (`0`), `docked` (`10`), `dropdown` (`100`), `sticky` (`200`), `drawer` (`300`), `modal` (`400`), `popover` (`500`), `toast` (`600`).

---

### 3.7 Motion (`tokens/motion/`)

Designed for a **dense, compact, and straightforward** interface: transitions are strictly functional (`0ms`–`200ms`) with no decorative overshoot or bouncy spring curves.

- **Global (`tokens/motion/global.json`)**:
  - **Duration (`global.duration.00`–`04`, `$type: "duration"`)**: `0ms`, `50ms`, `100ms`, `150ms`, `200ms`.
  - **Easing (`global.easing.*`, `$type: "cubicBezier"`)**:
    - `linear`: `[0, 0, 1, 1]`
    - `standard`: `[0.2, 0, 0, 1]`
    - `enter`: `[0, 0, 0.15, 1]`
    - `exit`: `[0.3, 0, 1, 1]`
- **System (`tokens/motion/system.json`)**:
  - **Duration (`system.motion.duration.*`)**: `instant` (`0ms`), `fast` (`50ms`), `normal` (`100ms`), `slow` (`150ms`), `slower` (`200ms`).
  - **Easing (`system.motion.easing.*`)**: `default` (`{global.easing.standard}`), `enter` (`{global.easing.enter}`), `exit` (`{global.easing.exit}`), `linear` (`{global.easing.linear}`).
