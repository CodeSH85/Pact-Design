# Pact Design — Token Specification

All token files strictly follow the **W3C Design Tokens Community Group (DTCG) Format Module 2025.10** specification (`$value`, `$type`). See <https://www.designtokens.org/tr/2025.10/format/> for full specification details.

---

## 1. Architecture & Principles

### 1.1 Three-Tier Token Hierarchy (Category–Type–Item)

Pact Design organizes design tokens into a single canonical tree (`tokens = { pd: { global, system, component } }`) in `packages/tokens/src/`, following Material 3's **Category–Type–Item** taxonomy and W3C DTCG 2025.10 (`$value`, `$type`, `$root`):

1. **Global (`pd.global.<domain>.*`)**: Foundation primitives with no semantic meaning (`color`, `opacity`, `spacing`, `size`, `border`, `radius`, `elevation`, `motion`, `font`).
2. **System (`pd.system.<domain>.*`)**: Semantic tokens representing themeable UI roles, hierarchy, and density (`color`, `opacity`, `spacing`, `size`, `border`, `radius`, `elevation`, `motion`, `font`).
3. **Component (`pd.component.<component>[.<variant-or-part>].<property>[.<state>]`)**: Scoped tokens bound to explicit property slots (`bg`, `text`, `border`, `icon`, `dot`, `shadow`) of specific UI components.

#### Global Level (`packages/tokens/src/global/*.ts`)

- Each file owns one disjoint namespace (`border`, `color`, `elevation`, `font`, `motion`, `opacity`, `radius`, `size`, `spacing`) with no cross-file merging.
- Serves as the single source of truth for raw values (OKLCH colors including `scrim` and `shadow` alphas, `rem`/`px` dimensions, font weights, stroke styles).
- Uses numeric scales (`00`, `01`, `02`... or `100`–`1200` for 12-step color palettes) rather than semantic names.

> [!IMPORTANT]
> Never reference `pd.global.*` tokens directly in application or component stylesheets. Always consume `pd.system.*` (or `pd.component.*`) tokens so themes and density adjustments propagate automatically.

#### System Level (`packages/tokens/src/system/*.ts`)

- Maps `pd.global.*` primitives to semantic roles (`color.{surface, on-surface, border, primary..neutral, shadow}`, `border.{width, focus}`, `radius`, `spacing`, `size.{3xs..5xl, control, icon}`, `font`, `elevation.{xs..xl, z}`, `motion.{duration, easing}`).
- Uses DTCG `$root` for base values inside nested state groups (e.g., `pd.system.color.surface.layer-1.$root` → `--pd-system-color-surface-layer-1`, `pd.system.color.surface.layer-1.hover` → `--pd-system-color-surface-layer-1-hover`).
- Uses a unified **T-shirt sizing scale** (`xs`, `sm`, `md`, `lg`, `xl`, with `3xs`–`5xl` extensions for spacing/sizing) anchored around `md`.

#### Component Level (`packages/tokens/src/component/*.ts`)

- Maps `pd.system.*` tokens to explicit component property slots (`bg`, `text`, `border`, `icon`, `dot`) and interactive state groups (`$root`, `hover`, `active`, `selected`, `disabled`, `focus`, `invalid`), enabling scoped customization without breaking system-wide semantics.

### 1.2 Structural Conventions

- **1:1 Source-to-CSS Path**: The object path in `packages/tokens/src/` maps directly to the emitted CSS variable (with `$root` stripped by `name/dtcg-kebab`). Build scripts carry no prefix injection or structural business logic.
- **Minimal Factory (`packages/tokens/src/factory.ts`)**: Provides pure leaf constructors (`oklch`, `rem`, `px`, `ms`, `num`, `ref`, `themed`, `scale`) only; theme resolution lives in `packages/tokens/utils/theme.js`.

---

## 2. Theming Strategy (Light & Dark Modes)

Pact Design implements theming at the **System (`pd.system.color.*`)** layer using explicit side-by-side declarations via `color({ light, dark })` in `packages/tokens/src/system/color.ts`:

- **100% Identical Token Paths**: Light and Dark values are paired directly on every leaf token. Theme names (`light` / `dark`) are never embedded in token paths.
- **Build-Time Resolution**: `scripts/build.ts` resolves the canonical `tokens` tree for `'light'` and `'dark'` via `utils/theme.js`, emitting `:root, [data-theme="light"]` defaults and `[data-theme="dark"]` overrides through Style Dictionary v5.

---

## 3. Token Categories

### 3.1 Color (`tokens/color/`)

#### Global Palettes (`tokens/color/global.json`)

- **Color Space**: Perceptually uniform **OKLCH** (`colorSpace: "oklch"`, `components: [L, C, H]`, `alpha`, plus sRGB `hex` fallback).
- **13 Scales × 12 Shades (`100`–`1200`)**: `gray`, `coolGray`, `warmGray`, `cyan`, `blue`, `indigo`, `purple`, `magenta`, `red`, `orange`, `yellow`, `green` (clean emerald hue at `H = 148°`), and `mint`, plus `white` (`#ffffff`) and `black` (`#000000`).
- **12-Step Perceptual Lightness Curve (`100` to `1200`)**:
  - `100` (`L = 0.968`) → `200` (`0.930`) → `300` (`0.870`) → `400` (`0.790`) → `500` (`0.698`) → **`600` (`0.600`, true perceptual midpoint)** → `700` (`0.504`) → `800` (`0.416`) → `900` (`0.344`) → `1000` (`0.288`) → `1100` (`0.244`) → `1200` (`0.208`).
  - `yellow` features elevated high-luminance light steps (`100`–`500`: `0.975`, `0.945`, `0.895`, `0.825`, `0.725`), joining the standard curve at `600` (`0.600`).
- **APCA & sRGB Gamut Baseline**:
  - All `600`–`1200` shades pass **APCA `|Lc| >= 60`** against `#ffffff` (`600` reaches `Lc +63.9` to `+74.4` as text on white and `Lc -69.4` to `-74.4` with white text on solid backgrounds; `700` reaches `Lc +77.1` to `+86.1` and WCAG `≥ 5.5:1`).
  - All 156 shades lie 100% within the standard sRGB gamut.

#### System Background Layers & Interactive Surface States (`system.background.*`)

Workspace surfaces are divided into four luminance layers, a translucent modal/drawer backdrop, and neutral gray interactive surface states (`hover`, `active`, `selected`, `selected-hover`) across `base`, `layer-1`, and `layer-2`:

| Token | Light Value | Dark Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| `system.background.base` | `{global.gray.200}` (`#e8e8e8`) | `{global.gray.1200}` (`#181818`) | Lowest application canvas / pasteboard. |
| `system.background.hover` | `{global.gray.100}` (`#f4f4f4`) | `{global.gray.1100}` (`#202020`) | Base / default neutral hover state (`|Lc| > 97` with `text.primary`). |
| `system.background.active` | `{global.gray.200}` (`#e8e8e8`) | `{global.gray.1000}` (`#2b2b2b`) | Base / default neutral pressed state (`|Lc| > 90` with `text.primary`). |
| `system.background.selected` | `{global.gray.200}` (`#e8e8e8`) | `{global.gray.1000}` (`#2b2b2b`) | Base / default neutral selected state (`|Lc| > 90` with `text.primary`). |
| `system.background.selected-hover` | `{global.gray.300}` (`#d4d4d4`) | `{global.gray.900}` (`#393939`) | Base / default hover state on an already-selected item (`|Lc| > 78` with `text.primary`). |
| `system.background.layer-1` | `{global.white}` (`#ffffff`) | `{global.gray.1100}` (`#202020`) | Primary structural chrome (`TopNav`, `Side-Nav`, docking toolbars, inspector panels). |
| `system.background.layer-1-hover` | `{global.gray.100}` (`#f4f4f4`) | `{global.gray.1000}` (`#2b2b2b`) | Neutral hover state on `layer-1` surfaces (`|Lc| > 90` with `text.primary`). |
| `system.background.layer-1-active` | `{global.gray.200}` (`#e8e8e8`) | `{global.gray.900}` (`#393939`) | Neutral pressed state on `layer-1` surfaces (`|Lc| > 78` with `text.primary`). |
| `system.background.layer-1-selected` | `{global.gray.200}` (`#e8e8e8`) | `{global.gray.900}` (`#393939`) | Neutral selected state on `layer-1` surfaces (`|Lc| > 78` with `text.primary`). |
| `system.background.layer-1-selected-hover` | `{global.gray.300}` (`#d4d4d4`) | `{global.gray.800}` (`#4c4c4c`) | Hover state on a selected `layer-1` item (`|Lc| > 78` with `text.primary`). |
| `system.background.layer-2` | `{global.gray.100}` (`#f4f4f4`) | `{global.gray.1000}` (`#2b2b2b`) | Main editing workspace, artboards, data tables, and primary content containers. |
| `system.background.layer-2-hover` | `{global.gray.100}` (`#f4f4f4`) | `{global.gray.900}` (`#393939`) | Neutral hover state on `layer-2` surfaces (`|Lc| > 94` with `text.primary`). |
| `system.background.layer-2-active` | `{global.gray.200}` (`#e8e8e8`) | `{global.gray.800}` (`#4c4c4c`) | Neutral pressed state on `layer-2` surfaces (`|Lc| > 84` with `text.primary`). |
| `system.background.layer-2-selected` | `{global.gray.200}` (`#e8e8e8`) | `{global.gray.800}` (`#4c4c4c`) | Neutral selected state on `layer-2` surfaces (`|Lc| > 84` with `text.primary`). |
| `system.background.layer-2-selected-hover` | `{global.gray.300}` (`#d4d4d4`) | `{global.gray.700}` (`#646464`) | Hover state on a selected `layer-2` item (`|Lc| > 78` with `text.primary`). |
| `system.background.elevated` | `{system.background.layer-2}` (`#f4f4f4`) | `{system.background.layer-2}` (`#2b2b2b`) | Floating elements over the workspace (contextual popovers, modals, dropdowns), paired with `system.elevation.*`. |
| `system.background.backdrop` | `{global.scrim.01}` (`#000000 · α 0.48`) | `{global.scrim.02}` (`#000000 · α 0.68`) | Translucent scrim / backdrop behind modals (`z-index.modal`) and drawers (`z-index.drawer`). |

#### System Text Hierarchy (`system.text.*`)

Engineered to pass **APCA** (`Lc`) and WCAG 2.1 contrast across **all background and interactive layers**:

| Token | Light Value | Light APCA (`Lc` on `layer-2`) | Dark Value | Dark APCA (`Lc` on `layer-2`) | Semantic Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `system.text.primary` | `{global.gray.1200}` (`#181818`) | `Lc +103.5` | `{global.white}` (`#ffffff`) | `Lc -100.9` | Headings, body copy, primary table cells, identifiers (`Lc 90+`). |
| `system.text.secondary` | `{global.gray.800}` (`#4c4c4c`) | `Lc +89.6` | `{global.gray.200}` (`#e8e8e8`) | `Lc -91.2` | Subheaders, form labels, secondary metadata (`Lc 75+`). |
| `system.text.muted` | `{global.gray.700}` (`#646464`) | `Lc +79.4` | `{global.gray.300}` (`#d4d4d4`) | `Lc -76.7` | Captions, helper text, timestamps (`Lc 70+`). |
| `system.text.disabled` | `{global.gray.500}` (`#9e9e9e`) | `Lc +51.8` | `{global.gray.600}` (`#808080`) | `Lc -31.2` | Disabled labels and inactive controls. |

#### System Border Colors (`system.border.*`)

| Token | Light Value | Dark Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| `system.border.subtle` | `{global.gray.200}` (`#e8e8e8`) | `{global.gray.900}` (`#393939`) | Internal panel dividers and dense table row hairlines (`|Lc| ~16` on dark `layer-2`). |
| `system.border.default` | `{global.gray.300}` (`#d4d4d4`) | `{global.gray.800}` (`#4c4c4c`) | Default container, card, and panel borders (`|Lc| ~28` on dark `layer-2`). |
| `system.border.strong` | `{global.gray.500}` (`#9e9e9e`) | `{global.gray.400}` (`#bababa`) | High-contrast form input borders (`|Lc| ~61` on dark `layer-2`). |
| `system.border.focus` | `{system.semantic.primary}` | `{global.indigo.400}` | Keyboard focus ring indicator (`|Lc| > 55` across all surfaces). |

#### System Semantic Status & Action Colors (`pd.system.color.<role>.*`)

Each semantic role (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `neutral`) defines a symmetric 4-pattern structure:

1. **Solid Action Pattern (`<role>.$root`, `hover`, `active`, `on-<role>.$root`)**:
   - Maintains a consistent **light-text on deep-background** hierarchy in both Light and Dark themes (`|Lc| >= 69` in Light, `|Lc| >= 82` in Dark).
2. **Subtle Status Container Pattern (`<role>.subtle.{ $root, hover, active }`, `on-<role>.subtle`, `<role>.border.$root`)**:
   - Uses same-hue soft backgrounds (`100 / 200 / 300` Light, `1000 / 900 / 800` Dark) paired with `on-<role>.subtle` (`800` Light, `300` Dark) — passing WCAG `>= 5.76:1` and APCA `|Lc| >= 63` across all interactive states.
3. **Foreground Text & Icons on Neutral Surfaces (`<role>.text.{ $root, hover, active }`)**:
   - Monotonically darker in Light (`700 → 800 → 900`) and monotonically lighter in Dark (`400 → 300 → 200`), ensuring links, checkmarks, toast icons, and error messages pass WCAG `>= 4.5:1` and APCA `|Lc| >= 60` on `surface.layer-1` (and `>= 4.5:1` / `|Lc| >= 45` on `surface.layer-2.hover`).
4. **Strong Graphic Borders & Focus Rings (`<role>.border.strong`, `border.focus.{ $root, danger, halo, danger-halo }`)**:
   - `600` (Light) / `400` (Dark) for active underlines, slider tracks/thumbs, and invalid/focus borders (WCAG `>= 3.0:1`, APCA `|Lc| >= 45` on `surface.layer-2`).
   - Translucent focus halos (`border.focus.halo`, `border.focus.danger-halo`) are derived at build time via `alpha(colorKey, opacityKey)` backed by `globalOpacity` and paired with `pd.system.elevation.focus.{ $root, danger }` (and `@media (forced-colors: active)` outline fallback on form fields). Because build-time `alpha()` emits concrete `oklch(L C H / alpha)` literals for Lightning CSS browser-target compatibility, runtime overrides of `--pd-global-color-*` will not dynamically re-tint baked halo tokens — override the semantic halo token directly instead.

| Role | Hue Family | Light Solid (`$root / hover / active / on`) | Dark Solid (`$root / hover / active / on`) | Light Subtle (`$root / hover / active / on / border`) | Dark Subtle (`$root / hover / active / on / border`) | Text (`Light` / `Dark`) | Border Strong (`Light` / `Dark`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | `indigo` | `600 / 700 / 800 / white` | `700 / 600 / 800 / white` | `100 / 200 / 300 / 800 / 300` | `1000 / 900 / 800 / 300 / 800` | `700–900` / `400–200` | `600` / `400` |
| **Secondary** | `blue` | `700 / 800 / 900 / white` | `700 / 600 / 800 / white` | `100 / 200 / 300 / 800 / 300` | `1000 / 900 / 800 / 300 / 800` | `700–900` / `400–200` | `600` / `400` |
| **Success** | `green` | `600 / 700 / 800 / white` | `700 / 600 / 800 / white` | `100 / 200 / 300 / 800 / 300` | `1000 / 900 / 800 / 300 / 800` | `700–900` / `400–200` | `600` / `400` |
| **Danger** | `red` | `600 / 700 / 800 / white` | `700 / 600 / 800 / white` | `100 / 200 / 300 / 800 / 300` | `1000 / 900 / 800 / 300 / 800` | `700–900` / `400–200` | `600` / `400` |
| **Warning** | `orange` | `600 / 700 / 800 / white` | `700 / 600 / 800 / white` | `100 / 200 / 300 / 800 / 300` | `1000 / 900 / 800 / 300 / 800` | `700–900` / `400–200` | `600` / `400` |
| **Info** | `blue` | `600 / 700 / 800 / white` | `700 / 600 / 800 / white` | `100 / 200 / 300 / 800 / 300` | `1000 / 900 / 800 / 300 / 800` | `700–900` / `400–200` | `600` / `400` |
| **Neutral** | `coolGray` | `700 / 800 / 900 / white` | `700 / 600 / 800 / white` | `100 / 200 / 300 / 800 / 300` | `1000 / 900 / 800 / 300 / 800` | `700–900` / `400–200` | `600` / `400` |

#### Opacity (`pd.global.opacity.*`, `pd.system.opacity.*`)

- **Global (`packages/tokens/src/global/opacity.ts`)**: `$type: "number"` scale (`00`, `05`, `08`, `12`, `16`, `20`, `24`, `28`, `32`, `48`, `64`, `80`, `100` → `0` to `1`).
- **System (`packages/tokens/src/system/opacity.ts`)**: Semantic opacity roles `disabled` (`0.48`), `hover` (`0.08`), `focus` (`0.12`), `pressed` (`0.16`), plus themed `halo` (`0.2` Light / `0.28` Dark) and `scrim` (`0.48` Light / `0.64` Dark).

---

### 3.2 Typography (`tokens/typography/`)

#### Global Primitives (`tokens/typography/global.json`)

- **Families (`global.font.family.*`)**: `sans` (`["Inter", "ui-sans-serif", "system-ui", "PingFang TC", "PingFang SC", "Microsoft JhengHei", "Microsoft YaHei", "Noto Sans CJK TC", "Noto Sans CJK SC", "sans-serif"]`), `mono` (`["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"]`).
- **Sizes (`global.font.size.01`–`13`)**: `0.5rem` (8px), `0.625rem` (10px), `0.75rem` (12px), `0.875rem` (14px), `1rem` (16px), `1.125rem` (18px), `1.25rem` (20px), `1.5rem` (24px), `1.75rem` (28px), `2rem` (32px), `2.25rem` (36px), `3rem` (48px), `3.75rem` (60px).
- **Weights (`global.font.weight.*`)**: `01` (300), `02` (400), `03` (500), `04` (600), `05` (700).
- **Line Heights (`global.font.line-height.01`–`09`)**: Unitless ratios from `1.1` to `1.7`.
- **Letter Spacing (`global.font.letter-spacing.01`–`10`)**: `-0.04rem` to `0.05rem` (`05` = `0rem`).

#### System Semantic Font Families & Weights (`system.font.family.*`, `system.font.weight.*`)

Semantic families and orthogonal font weights decouple brand typography and emphasis from scale:

- `system.font.family.sans` → `global.font.family.sans`
- `system.font.family.mono` → `global.font.family.mono`
- `system.font.weight.normal` → `global.font.weight.02` (`400`)
- `system.font.weight.medium` → `global.font.weight.03` (`500`)
- `system.font.weight.bold` → `global.font.weight.04` (`600`)

#### System Composite Typography (`packages/tokens/src/system/typography.ts`)

All 18 system typography tokens use `$type: "typography"` (`fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`), referencing `system.font.family.*` and `system.font.weight.*`:

| Category | Scale | Sizes (`px` / `rem`) | Default Weight | Allowed Weights | Line Height | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `system.font.display` | `sm`, `md` | 36px, 48px | `bold` (600) | `normal`, `medium`, `bold` | `1.1`–`1.15` | `-0.03` to `-0.02rem` | Hero metrics and large promotional callouts. |
| `system.font.heading` | `xs`, `sm`, `md`, `lg`, `xl` | 16px, 18px, 20px, 24px, 32px | `bold` (600) | `medium`, `bold` | `1.2`–`1.4` | `-0.02` to `0rem` | Page, section, panel, and dialog titles. |
| `system.font.body` | `sm`, **`md`**, `lg` | 14px, **16px**, 18px | `normal` (400) | `normal` | `1.5`–`1.6` | `0rem` | Reading copy and table content (`md` = `1rem`). |
| `system.font.label` | `xs`, `sm`, **`md`**, `lg` | 12px, 14px, **16px**, 18px | `normal` (400) | `normal`, `medium` | `1.3` | `0` to `0.02rem` | Form labels, buttons, tabs, and navigation items. |
| `system.font.caption` | `sm`, `md` | 10px, 12px | `normal` (400) | `normal`, `medium` | `1.4` | `0.01` to `0.02rem` | Image captions, footnotes, and helper annotations. |
| `system.font.mono` | `xs`, `sm` | 12px, 14px | `normal` (400) | `normal` | `1.4` | `0rem` | Identifiers (`ID-2026-0048`), version strings (`v2.1.0`), hashes, and code snippets. |

#### Tabular Numerals Convention (`.tabular-nums`)

For numeric columns in data tables, metrics (`12.05 ms`), quantities, and percentages that retain the proportional `sans` typeface (`system.font.body.*` / `system.font.label.*`), apply the CSS OpenType numeric modifier rather than switching font families:

```css
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

---

### 3.3 Spacing (`tokens/spacing/`)

- **Global (`global.spacing.00`–`13`)**: `0px` (`00`), `0.0625rem` (1px) hairline, and `0.125rem` (2px) up to `4rem` (64px).
- **System (`system.spacing.*`)**: Anchored at `md = 0.5rem` (8px) for dense, high-density desktop & data UI:
  - `none` (0px), `3xs` (1px), `2xs` (2px), `xs` (4px), `sm` (6px), **`md` (8px)**, `lg` (12px), `xl` (16px), `2xl` (20px), `3xl` (24px), `4xl` (32px), `5xl` (48px).

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
