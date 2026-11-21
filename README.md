# Pact Design

**Pact Design** is a domain-neutral design token system engineered for **dense, compact, and straightforward** user interfaces.

Built strictly on the **W3C Design Tokens Community Group (DTCG) 2025.10** specification and authored in a strongly typed **TypeScript token DSL**, Pact Design prioritizes high information density, crisp structural hierarchy, and perceptual contrast precision—without unnecessary whitespace, decorative visual noise, or flashy animations.

---

## Design Philosophy

- **Dense & Compact**: Engineered around compact sizing and tight spatial rhythm (`24px`–`28px` compact controls, `0px`–`4px` sharp corner radii) to maximize information visibility in data-heavy workspaces, tables, and multi-pane layouts.
- **Straightforward & Functional**: Every token serves a clear structural or interactive purpose. Motion is strictly functional (`0ms`–`200ms` with linear and crisp easing curves—no bouncy spring overshoot or decorative flourishes).
- **Domain-Neutral**: Designed as a general-purpose foundation that adapts cleanly to any professional web application without domain-specific coupling.

---

## Key Features

- **W3C DTCG 2025.10 Compliant TypeScript DSL**: Authored in TypeScript (`src/dsl/`) with compile-time path validation and assembled in-memory into structured `$value` and `$type` schemas (`color`, `dimension`, `duration`, `fontFamily`, `fontWeight`, `number`, `strokeStyle`, `cubicBezier`, `typography`, `shadow`) across 7 foundation categories (`color`, `typography`, `spacing`, `sizing`, `border`, `elevation`, `motion`).
- **3-Tier Token Hierarchy**:
  - **`global`**: Raw primitives (12-step OKLCH color palettes `100`–`1200`, scrims, modular spacing/sizing/border/elevation/motion scales, typographic primitives).
  - **`system`**: Semantic and theme-aware tokens (`light` & `dark` modes modeled via `themed(light, dark)`) for surfaces (`background`), foregrounds (`on-surface`), borders (`border`, `focus`), semantic roles (`semantic.*`), elevation, and typography.
  - **`component`**: Scoped tokens for compact UI primitives (`button`, `checkbox`, `disclosure`, `field`, `modal`, `popover`, `radio`, `switch`, `tab`, `toast`).
- **Perceptually Uniform Color & APCA Contrast**:
  - Global palettes authored in **OKLCH** with synchronized lightness steps (`600` anchored at `L = 0.600`), 100% within the sRGB gamut.
  - Audited against **APCA (Accessible Perceptual Contrast Algorithm, WCAG 3.0 candidate)** as the primary readability metric across both `:root, [data-theme="light"]` and `[data-theme="dark"]` themes.
- **Decoupled Token & Web Styling Pipeline**:
  - **`@pact-design/tokens`**: Compiles TypeScript DSL tokens via Style Dictionary v5 into raw `--pd-*` CSS custom properties (`build/css/_variables.css`) and a pure token metadata manifest (`build/meta/tokens.json`), keeping source tokens free of target-specific `$extensions`.
  - **`@pact-design/styles`**: Consumes `@pact-design/tokens` to bundle self-contained layered CSS (`@layer pact.tokens, pact.theme;` with Light/Dark `color-scheme` support for native scrollbars and controls) and a typed UnoCSS preset (`build/uno/preset.js`, `preset.d.ts`) driven by declarative rules (`src/uno/rules.ts`).
- **Precision Typography**: Pairs proportional sans-serif scales (`tabular-nums` ready for numeric alignment) with dedicated monospace tokens (`system.font.mono.*`) for technical identifiers, hashes, and version tags.
- **3-Tier Monorepo Architecture**: Managed via `pnpm` workspaces separating pure design tokens (`@pact-design/tokens`), the web styling layer (`@pact-design/styles`), React Aria component primitives (`@pact-design/react`), and the documentation app (`pact-site`).

---

## Repository Structure

```txt
Pact-Design/
├── packages/
│   ├── tokens/              # @pact-design/tokens (publishable DTCG token package)
│   │   ├── src/             # TypeScript token DSL (dsl/) & 3-tier definitions (global, system, component)
│   │   ├── scripts/         # Style Dictionary v5 build, DTCG transforms, CSS & metadata formats
│   │   ├── utils/           # Isomorphic color, APCA/WCAG contrast & token utilities
│   │   ├── test/            # Automated APCA contrast & build-contract tests
│   │   └── build/           # Generated CSS variables (css/_variables.css) & metadata (meta/tokens.json)
│   ├── styles/              # @pact-design/styles (publishable web styling layer)
│   │   ├── src/             # Theme CSS (css/theme.css) & UnoCSS preset rules/generator (uno/)
│   │   ├── scripts/         # Composed CSS layer & UnoCSS preset builder
│   │   ├── test/            # CSS layer, color-scheme & UnoCSS build-contract tests
│   │   └── build/           # Generated CSS layers (css/index.css, css/theme.css) & UnoCSS preset (uno/)
│   └── react/               # @pact-design/react (React Aria + Pact Design components)
│       ├── src/             # 29 accessible React components & style utilities
│       └── test/            # Package export & structure contract tests
├── site/                    # pact-site (Interactive documentation & Token Playground)
│   ├── src/                 # React 19 + Vite + TanStack Router + UnoCSS
│   └── public/              # Static assets
└── docs/                    # Design specifications & architecture decisions
    ├── spec/                # Specification MDX documents
    ├── components/          # Component reference MDX documentation
    ├── token.md             # Token specification & architecture reference
    ├── roadmap.md           # Implementation milestones & roadmap
    └── repo-structure.md    # Monorepo architecture decision record
```

---

## Quick Start

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Build design tokens (CSS custom properties + metadata manifest) & run token tests
pnpm build:tokens

# 3. Build web styles (layered CSS + theme color-scheme + UnoCSS preset) & run style tests
pnpm build:styles

# 4. Run automated test suites across all packages
pnpm test

# 5. Run TypeScript type checks across all workspace packages
pnpm typecheck

# 6. Launch the Documentation & Token Playground site locally (http://localhost:5173)
pnpm site:dev

# 7. Run ESLint across the monorepo
pnpm lint

# 8. Build tokens, styles, and bundle the Documentation Site (site/dist)
pnpm site:build
```

---

## Consuming Pact Design

### Styles & UnoCSS (`@pact-design/styles`)

```bash
pnpm add @pact-design/styles
```

```css
/* Self-contained layered CSS: @layer pact.tokens, pact.theme;
   Includes all --pd-* CSS variables and Light/Dark color-scheme rules */
@import '@pact-design/styles/css';

/* Or import only the Light/Dark color-scheme rules if loading @pact-design/tokens/css separately */
@import '@pact-design/styles/css/theme';
```

```javascript
// uno.config.ts
import { defineConfig, presetWind3 } from 'unocss'
import { pactPreset } from '@pact-design/styles/uno'

export default defineConfig({
  presets: [
    presetWind3(),
    // Pass { preflights: true } to inject color-scheme via UnoCSS when not importing @pact-design/styles/css
    pactPreset()
  ]
})
```

### Design Tokens & Utilities (`@pact-design/tokens`)

```bash
pnpm add @pact-design/tokens
```

```css
/* Raw --pd-* CSS variables only (without CSS layers or color-scheme rules) */
@import '@pact-design/tokens/css';
```

```javascript
import { tokenModules } from '@pact-design/tokens/src/index.ts'
import { colorValueToCss, oklchToRgb } from '@pact-design/tokens/utils/color.js'
import { calculateAPCA } from '@pact-design/tokens/utils/contrast.js'
```

### React Components (`@pact-design/react`)

```bash
pnpm add @pact-design/react @pact-design/styles react-aria-components
```

```tsx
import '@pact-design/styles/css'
import { Button } from '@pact-design/react'
```

---

## Documentation

- [**Documentation & Playground Site**](https://codesh85.github.io/Pact-UI/) — Interactive foundation showcase (Color, APCA contrast, Typography, Sizing & Spacing, Elevation & Motion) and live Token Playground.
- [**Design Token Architecture (`docs/token.md`)**](./docs/token.md) — Detailed specification of token tiers, naming conventions, OKLCH scales, and CSS variable output.
- [**Monorepo Architecture Decision (`docs/repo-structure.md`)**](./docs/repo-structure.md) — Multi-package workspace layout, dependency graph, and migration rationale.
- [**Improvement Roadmap (`docs/roadmap.md`)**](./docs/roadmap.md) — Completed phases and upcoming milestones (component token tier, component packages).
