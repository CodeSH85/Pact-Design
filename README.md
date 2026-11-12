# Pact Design

**Pact Design** is a domain-neutral design token system engineered for **dense, compact, and straightforward** user interfaces.

Built strictly on the **W3C Design Tokens Community Group (DTCG) 2025.10** specification, Pact Design prioritizes high information density, crisp structural hierarchy, and perceptual contrast precision—without unnecessary whitespace, decorative visual noise, or flashy animations.

---

## Design Philosophy

- **Dense & Compact**: Engineered around compact sizing and tight spatial rhythm (`24px`–`28px` compact controls, `0px`–`4px` sharp corner radii) to maximize information visibility in data-heavy workspaces, tables, and multi-pane layouts.
- **Straightforward & Functional**: Every token serves a clear structural or interactive purpose. Motion is strictly functional (`0ms`–`200ms` with linear and crisp easing curves—no bouncy spring overshoot or decorative flourishes).
- **Domain-Neutral**: Designed as a general-purpose foundation that adapts cleanly to any professional web application without domain-specific coupling.

---

## Key Features

- **W3C DTCG 2025.10 Compliant**: Uses structured `$value` and `$type` schemas (`color`, `dimension`, `duration`, `cubicBezier`, `typography`, `shadow`) across 7 token categories (`color`, `typography`, `spacing`, `sizing`, `border`, `elevation`, `motion`).
- **3-Tier Token Hierarchy**:
  - **`global`**: Raw primitives (11-step OKLCH color palettes `50`–`1000`, modular spacing/sizing scales, typographic primitives).
  - **`system`**: Semantic and theme-aware tokens (`light` & `dark` modes) for surfaces, text, borders, interactive states, focus rings, and elevation.
  - **`component`** *(planned)*: Scoped tokens for compact UI primitives.
- **Perceptually Uniform Color & APCA Contrast**:
  - Global palettes authored in **OKLCH** with synchronized lightness steps (`500` anchored at `L = 0.600`), 100% within the sRGB gamut.
  - Audited against **APCA (Accessible Perceptual Contrast Algorithm, WCAG 3.0 candidate)** as the primary readability metric across both Light and Dark themes.
- **Precision Typography**: Pairs proportional sans-serif scales (`tabular-nums` ready for numeric alignment) with dedicated monospace tokens (`system.font.mono.*`) for technical identifiers, hashes, and version tags.
- **Modern Monorepo Architecture**: Managed via `pnpm` workspaces separating the core token compiler/utilities from the documentation app and future component packages.

---

## Repository Structure

```txt
Pact-Design/
├── packages/
│   └── tokens/              # @pact-design/tokens (publishable token library)
│       ├── tokens/          # W3C DTCG 2025.10 JSON files
│       ├── scripts/         # Style Dictionary build & UnoCSS preset generator
│       ├── utils/           # Isomorphic color, APCA/WCAG contrast & token utilities
│       ├── test/            # Automated APCA contrast & token integrity tests
│       └── build/           # Generated CSS variables and UnoCSS presets
├── site/                    # pact-site (Interactive documentation & Token Playground)
│   ├── src/                 # React 19 + Vite + TanStack Router + UnoCSS
│   └── public/              # Static assets
└── docs/                    # Design specifications & architecture decisions
    ├── spec/                # Specification MDX documents
    ├── token.md             # Token specification & architecture reference
    ├── roadmap.md           # Implementation milestones & roadmap
    └── repo-structure.md    # Monorepo architecture decision record
```

---

## Quick Start

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Build design tokens (CSS custom properties + UnoCSS preset) & run tests
pnpm build:tokens

# 3. Run automated APCA / WCAG contrast test suite across packages
pnpm test

# 4. Launch the Documentation & Token Playground site locally (http://localhost:5173)
pnpm site:dev

# 5. Run ESLint across the monorepo
pnpm lint

# 6. Build tokens, run tests, and bundle the Documentation Site (site/dist)
pnpm site:build
```

---

## Consuming `@pact-design/tokens`

```bash
pnpm add @pact-design/tokens
```

### CSS Custom Properties
```css
/* Import themed CSS variables (:root and [data-theme="dark"]) */
@import '@pact-design/tokens/css';
```

### UnoCSS / Tailwind Integration
```javascript
// uno.config.js
import { defineConfig, presetWind3 } from 'unocss'
import { pactPreset } from '@pact-design/tokens/uno'

export default defineConfig({
  presets: [
    presetWind3(),
    pactPreset()
  ]
})
```

### Utilities & Raw Tokens
```javascript
import { colorValueToCss, oklchToRgb } from '@pact-design/tokens/utils/color.js'
import { calculateAPCA } from '@pact-design/tokens/utils/contrast.js'
```

---

## Documentation

- [**Documentation & Playground Site**](https://codesh85.github.io/Pact-UI/) — Interactive foundation showcase (Color, APCA contrast, Typography, Sizing & Spacing, Elevation & Motion) and live Token Playground.
- [**Design Token Architecture (`docs/token.md`)**](./docs/token.md) — Detailed specification of token tiers, naming conventions, OKLCH scales, and CSS variable output.
- [**Monorepo Architecture Decision (`docs/repo-structure.md`)**](./docs/repo-structure.md) — Multi-package workspace layout, dependency graph, and migration rationale.
- [**Improvement Roadmap (`docs/roadmap.md`)**](./docs/roadmap.md) — Completed phases and upcoming milestones (component token tier, component packages).
