# Pact Design — Core Philosophy & Improvement Roadmap

This document tracks the core design principles, architectural milestones, and remaining roadmap items for **Pact Design**, a domain-neutral design system built for data-intensive applications.

---

## 1. Core Design Philosophy

Pact Design is a **domain-neutral** design system engineered around a **dense, compact, and straightforward** design ethos. It avoids domain-specific jargon or decorative visual flourishes so it can power any complex productivity, enterprise, or data-heavy web application:

1. **Dense & Compact Layout**: Maximize information density across data grids, tree views, forms, and multi-pane docking workspaces (`TopNav`, `Side-Nav`, `Canvas`, `Drawer`) by minimizing unnecessary whitespace and providing fine-grained compact scales (`none: 0px`, `3xs: 2px`, `2xs: 4px`, `control.height.xs: 24px`–`sm: 28px`).
2. **Straightforward & Unornamented**: Eliminate superfluous decoration, oversized pill radii, and flashy or bouncy animations. Motion is strictly functional (`0ms`–`200ms`, linear and crisp ease-out/in curves without spring overshoot).
3. **Precision & Scannability**: Ensure identifiers, version strings, hashes, and numerical columns align vertically and remain unambiguously legible (`system.font.mono.*` and `.tabular-nums`).
4. **Controlled Visual Hierarchy**: Use neutral luminance steps (`base` → `layer-1` → `layer-2` → `elevated`) so chromatic color is reserved strictly for meaningful semantic status and interactive actions.
5. **Perceptual Accessibility (APCA & WCAG 2.1)**: Guarantee perceptual contrast compliance (`APCA |Lc|`) across both Light and Dark themes for long working sessions.

---

## 2. Completed Milestones

- [x] **W3C DTCG 2025.10 Alignment**: Standardized `$value` and `$type` properties across all token categories and nested hyphen-free JSON hierarchies.
- [x] **11-Step Perceptual Color Palettes (`50`–`1000`)**: Expanded all 13 OKLCH color scales to 11 steps with `500` anchored at the perceptual midpoint (`L = 0.600`), 100% within the sRGB gamut.
- [x] **System Typography Scale & Monospace Support**: Established 27 composite typography tokens across `display`, `heading`, `subheader`, `body`, `label`, `caption`, and `mono`, anchored at `body.md = 1rem (16px)`.
- [x] **Light & Dark Multi-File Architecture**: Split semantic colors and shadow alphas into `*.light.json` and `*.dark.json` with 100% key parity.
- [x] **Workspace Background, Text, & Border Semantics**: Implemented `system.background.{base, layer-1, layer-2, elevated, backdrop, hover, active, selected, selected-hover}`, `system.text.{primary, secondary, muted, disabled}`, and `system.border.{subtle, default, strong, focus}`.
- [x] **APCA Perceptual Contrast Calibration**: Integrated official APCA-W3 (`0.1.9 / SAPC 4g`) across the Playground and automated tests, calibrating solid (`字淺背景深`) and subtle (`同色系`) semantic pairs across Light and Dark modes.
- [x] **Native DTCG Build Pipeline (`scripts/sd.config.js`)**: Refactored Style Dictionary v5 configuration to use native DTCG support (`usesDtcg: true`), built-in CSS shorthand transforms, custom OKLCH object serialization (`dtcg/color/oklch`), numeric scale sorting, and `outputReferences: true`.
- [x] **Automated APCA Contrast Test Gate (`test/contrast.test.js`)**: Integrated Node.js test runner (`node --test`) into `pnpm build:sd` to verify all 23 semantic foreground/background pairs across `:root` (Light) and `[data-theme="dark"]` (Dark) against APCA `|Lc|` thresholds on every build.
- [x] **Isomorphic Shared Utility Layer (`utils/`)**: Consolidated all color math (`utils/color.js`), APCA/WCAG contrast algorithms (`utils/contrast.js`), DTCG token parsing/CSS generation (`utils/token.js`), and helpers (`utils/helper.js`) into zero-dependency ES modules shared between Node CLI scripts, tests, and the browser Playground.

---

## 3. Completed Implementation Phases

### Phase 1 — Native DTCG Build Pipeline & Shared Utilities ✅ Completed

All `dimension`, `duration`, `cubicBezier`, `fontFamily`, `typography`, and `shadow` tokens transform and expand cleanly in `build/css/_variables.css` with live `var(--*)` cascading and zero code duplication between Node and browser environments.

- [x] **Style Dictionary v5 Native DTCG Integration (`scripts/sd.config.js`)**: Enabled `usesDtcg: true` and built-in DTCG transforms (`dimension`, `duration`, `fontFamily`, `cubicBezier`, `typography/css/shorthand`, `shadow/css/shorthand`).
- [x] **DTCG OKLCH Object Transform (`dtcg/color/oklch`)**: Convert DTCG `{ colorSpace: "oklch", components, alpha }` objects into CSS `oklch(...)` strings.
- [x] **Composite Property Expansion & Reference Preservation**: Expand composite `typography` tokens into shorthand + sub-property CSS variables (`-font-family`, `-font-size`, `-font-weight`, `-line-height`, `-letter-spacing`) and preserve `var(--global-*)` references via `outputReferences: true`.
- [x] **Single Source of Truth in `utils/`**: Deduplicated all color, contrast, and token manipulation utilities out of `playground/js/` into isomorphic `utils/*.js` modules.
- [x] **Automated Build Verification (`test/contrast.test.js`)**: Enforced automated APCA contrast assertions on generated CSS variables during `pnpm build:sd`.

---

### Phase 2 — Monospace Typography & Numeric Precision ✅ Completed

Dense data tables and technical interfaces require strict character alignment for identifiers (`ID-2026-0048`), version strings (`v2.1.0`), hashes, and numeric metrics (`12.05 ms`).

- [x] **Add Monospace Font Family (`tokens/typography/global.json`)**:
  - Defined `global.font.family.mono` (`["JetBrains Mono", "SFMono-Regular", "Menlo", "Consolas", "monospace"]`).
- [x] **Add Monospace Typography Tokens (`tokens/typography/system.json`)**:
  - Defined `system.font.mono.{xs, sm, md}` (`12px`, `14px`, `16px`) referencing `{global.font.family.mono}` for IDs, codes, and technical metadata.
- [x] **Document Tabular Numerals Utility**:
  - Documented `.tabular-nums { font-variant-numeric: tabular-nums; }` in `docs/token.md` and added interactive side-by-side comparison and table column alignment in the Playground.

---

### Phase 3 — Subtle Status Containers & Solid Action States ✅ Completed

In high-density tables with dozens of rows, solid `500`-shade status badges create visual noise. Status badges, inline banners, and tags now use soft same-hue container variants alongside interactive solid action states (`*-hover`, `*-active`).

- [x] **Add Subtle Status & Action State Tokens (`tokens/color/system.{light,dark}.json`)**:
  - For `primary`, `secondary`, `success`, `warning`, `danger`, `info`, and `neutral`, added:
    - `*-hover` and `*-active` for solid interactive controls (maintaining light-text on deep-background `字淺背景深` across Light and Dark modes).
    - `*-subtle` (Light: `100` shade; Dark: `900` shade)
    - `on-*-subtle` (Light: `700` shade; Dark: `200` shade, achieving APCA `|Lc| >= 75` on `*-subtle`)
    - `*-border` (Light: `200` shade; Dark: `700` shade)
- [x] **Add Neutral Semantic Role (`neutral`)**:
  - Added full `neutral` (`coolGray`) solid and subtle container family for default/draft/archived states.

---

### Phase 4 — Interactive States, Compact Density, Focus Ring, & Icon Sizing ✅ Completed

Dense interfaces rely heavily on keyboard navigation, compact rows, and crisp borders without wasted whitespace.

- [x] **Interactive Surface States & Backdrop Scrim (`tokens/color/system.{light,dark}.json`)**:
  - Defined `system.background.hover`, `system.background.active`, `system.background.selected`, `system.background.selected-hover`, and `system.background.backdrop` (`{global.scrim.01}` α `0.48` in Light, `{global.scrim.02}` α `0.68` in Dark).
- [x] **Sharp / Compact Border Radii, Control Density, & Icon Sizing (`tokens/border/`, `tokens/sizing/`, `tokens/spacing/`)**:
  - Added `global.radius.00` (`0px`) and `global.radius.01` (`0.125rem` / `2px`), mapped to `system.radius.none` (`0px`) and `system.radius.2xs` (`2px`) for flush panels, compact badges, and dense grid cells.
  - Added `system.spacing.none` (`0px`), `system.control.height.{xs, sm, md, lg, xl}` (`24px`–`40px`), and `system.icon.size.{xs, sm, md, lg, xl}` (`12px`–`32px`).
- [x] **Border Naming Unification & Focus Ring Geometry (`tokens/border/`)**:
  - Unified `global.stroke.*` → `global.border.{width, style}.*` and `system.stroke.*` → `system.border.width.{none, sm, md, lg}` to align with `system.border.{subtle, default, strong, focus}`.
  - Added `global.border.offset.{inset-02, inset-01, 00, 01, 02}` and `system.focus.{width, style, offset.{default, flush, inset}}` (`+2px` outer, `0px` flush, `-2px` inset for `overflow: hidden` grid cells).

---

### Phase 5 — Dark Mode Elevation, Z-Index, & Functional Motion ✅ Completed

- [x] **Dark Mode Elevation Refinement (`tokens/elevation/`)**: Added `global.shadow.color.06`–`10` (`α 0.28`–`0.68`) and split themed `system.shadow.color.{xs..xl}` across `tokens/elevation/system.{light,dark}.json`.
- [x] **Z-Index Stacking Scale (`tokens/elevation/`)**: Added `global.z-index.00`–`07` (`0`–`600`) and `system.z-index.{base, docked, dropdown, sticky, drawer, modal, popover, toast}`.
- [x] **Functional Motion Tokens (`tokens/motion/`)**: Added crisp, non-decorative durations (`global.duration.00`–`04`: `0ms`–`200ms`, `system.motion.duration.{instant, fast, normal, slow, slower}`) and functional easing curves (`standard`, `enter`, `exit`, `linear` — no bouncy spring overshoot).

---

## 4. Future Optimization Roadmap

### Priority 1 — Component Token Tier (`tokens/component/`)

Complete the 3-tier token architecture (`global` → `system` → `component`) by introducing component-scoped semantic tokens that reference `system.*` tokens without hardcoding raw primitives:

- [ ] **Core Interactive Primitives (`tokens/component/button.json`, `input.json`, `badge.json`)**:
  - Define height, horizontal padding, gap, border radius, font shorthand, and state-specific background/text/border mappings across compact sizes (`xs`, `sm`, `md`).
- [ ] **High-Density Data Surfaces (`tokens/component/table.json`, `tree.json`, `toolbar.json`)**:
  - Define row height (`compact: 28px`, `default: 32px`), cell padding, header background, sticky column shadow, tree indentation step, and dense toolbar item spacing.
- [ ] **Playground Component Tier Support (`playground/js/`)**:
  - Enable `component` level filtering in the Playground sidebar, visualize `global` → `system` → `component` dependency chains, and bind live preview components directly to `--component-*` CSS variables.

---

### Priority 2 — Expanded Automated Testing & Schema Guardrails (`test/`)

Build on `test/contrast.test.js` to ensure full structural, mathematical, and thematic integrity on every commit and build:

- [ ] **W3C DTCG 2025.10 Schema & Alias Integrity Test (`test/schema.test.js`)**:
  - Validate that every leaf token across `tokens/**/*.json` defines valid `$value` and `$type` properties (with `$value` preceding `$type`), follows hyphen-free naming rules where required, and contains zero broken or circular `{alias}` references.
- [ ] **Light & Dark Theme Parity Test (`test/parity.test.js`)**:
  - Assert 100% key-path and `$type` symmetry between all `*.light.json` and `*.dark.json` token files (`tokens/color/`, `tokens/elevation/`) to prevent missing variables when switching themes.
- [ ] **OKLCH Gamut & Scale Monotonicity Test (`test/color.test.js`)**:
  - Verify that all `global.color.*` tokens remain strictly within the sRGB gamut (`r, g, b ∈ [0, 1]`) and maintain strictly monotonic lightness (`L`) progression from step `50` to `1000`.

---

### Priority 3 — Extended Semantic Tokens for Data-Intensive Interfaces

Expand system-level tokens to cover specialized high-density UI patterns while staying strictly domain-neutral:

- [ ] **Data Visualization & Categorical Palette (`tokens/color/chart.{light,dark}.json`)**:
  - Define perceptually uniform, colorblind-safe categorical series (`system.chart.series.01`–`08`) and sequential/diverging ramps calibrated against `system.background.{base, layer-1}` in both Light and Dark modes.
- [ ] **Diff & Comparison Semantics (`tokens/color/diff.{light,dark}.json`)**:
  - Add semantic tokens (`system.diff.{added, modified, deleted, renamed}-{bg, text, border}`) for side-by-side record comparisons, version diffs, and audit logs.
- [ ] **Split-Pane Resizer & Scrollbar Tokens (`tokens/sizing/`, `tokens/color/`)**:
  - Define ultra-compact scrollbar thumb/track tokens and split-pane sash/resizer hit-area and active highlight tokens for multi-pane docking workspaces.

---

### Priority 4 — Multi-Format Distribution & Playground DX

Make Pact Design easier to consume across modern frontend frameworks and streamline token authoring workflows:

- [ ] **Multi-Format Build Outputs (`scripts/sd.config.js`)**:
  - Emit strongly-typed TypeScript/ESM token maps (`build/ts/tokens.js` & `tokens.d.ts`) and resolved JSON bundles (`build/json/tokens.{light,dark}.json`) alongside `build/css/_variables.css`.
- [ ] **Exportable CSS Utility Preset (`build/css/_utilities.css`)**:
  - Generate optional lightweight CSS utility classes for composite typography tokens (`.font-body-sm`, `.font-mono-xs`, `.tabular-nums`) and focus rings (`.focus-ring`, `.focus-ring-inset`).
- [ ] **Playground Authoring Enhancements (`playground/`)**:
  - Add an uncommitted changes diff viewer before saving to `tokens/`, reverse lookup by CSS variable or hex/OKLCH value, and an interactive APCA contrast matrix across surface and text tokens.
